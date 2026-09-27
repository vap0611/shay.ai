import {
  AcousticFeatures,
  HelplineCase,
  LexiconHit,
  MicroScreeningAnswers,
  OverrideTrigger,
  RiskLevel,
  SubScores,
  SVIResult
} from '../types';
import { ATROCITY_LEXICON } from '../data/lexicon';

export function getCategoryFromScore(score: number): RiskLevel {
  if (score >= 76) return 'Critical';
  if (score >= 51) return 'High';
  if (score >= 26) return 'Moderate';
  return 'Low';
}

export function rankCategory(level: RiskLevel): number {
  switch (level) {
    case 'Critical': return 4;
    case 'High': return 3;
    case 'Moderate': return 2;
    case 'Low': return 1;
  }
}

export function maxCategory(c1: RiskLevel, c2: RiskLevel): RiskLevel {
  return rankCategory(c1) >= rankCategory(c2) ? c1 : c2;
}

export function bumpCategory(current: RiskLevel): RiskLevel {
  if (current === 'Low') return 'Moderate';
  if (current === 'Moderate') return 'High';
  return 'Critical';
}

export function scanLexicon(text: string): LexiconHit[] {
  const hits: LexiconHit[] = [];
  const lower = text.toLowerCase();

  for (const item of ATROCITY_LEXICON) {
    if (lower.includes(item.term.toLowerCase())) {
      hits.push({
        term: item.term,
        originalText: item.englishMeaning,
        category: item.category,
        severity: item.severity,
        language: item.languages[0]
      });
    }
  }

  return hits;
}

export interface EvaluateSVIParams {
  transcript: string;
  acoustic: AcousticFeatures;
  screening?: Partial<MicroScreeningAnswers>;
  isMinorOrElderly?: boolean;
  isSexualViolenceRecent?: boolean;
  confidence?: number;
  asrFailed?: boolean;
  unsupportedLanguage?: boolean;
}

export function calculateSVI(params: EvaluateSVIParams): SVIResult {
  const {
    transcript,
    acoustic,
    screening = {},
    isMinorOrElderly = false,
    isSexualViolenceRecent = false,
    confidence = 0.88,
    asrFailed = false,
    unsupportedLanguage = false,
  } = params;

  const textLower = transcript.toLowerCase();
  const lexiconHits = scanLexicon(transcript);

  // 1. Text Narrative Analysis (Base indicators)
  let baseED = 15;
  let baseSH = 5;
  let baseTH = 10;
  let baseSI = 12;

  // Keyword / Lexicon influence
  lexiconHits.forEach(hit => {
    if (hit.category === 'threat') {
      baseTH += hit.severity === 'critical' ? 45 : 25;
      baseED += 20;
    } else if (hit.category === 'retaliation') {
      baseTH += 30;
      baseED += 15;
    } else if (hit.category === 'boycott') {
      baseSI += 40;
      baseED += 15;
    } else if (hit.category === 'self_harm') {
      baseSH += hit.severity === 'critical' ? 55 : 30;
      baseED += 25;
    } else if (hit.category === 'caste_abuse') {
      baseTH += 20;
      baseED += 20;
    }
  });

  // Additional English/Hinglish triggers
  if (textLower.includes('kill') || textLower.includes('mar dalenge') || textLower.includes('burn')) {
    baseTH = Math.max(baseTH, 78);
  }
  if (textLower.includes('suicide') || textLower.includes('die') || textLower.includes('end my life') || textLower.includes('khatam kar')) {
    baseSH = Math.max(baseSH, 82);
  }
  if (textLower.includes('boycott') || textLower.includes('water') || textLower.includes('pani band')) {
    baseSI = Math.max(baseSI, 70);
  }

  // 2. Micro-screening clinical anchor contributions (PHQ-2, GAD-2, PC-PTSD-5, C-SSRS)
  if (screening.phq2_depressedMood !== undefined) {
    baseED += screening.phq2_depressedMood * 7;
  }
  if (screening.gad2_anxiety !== undefined) {
    baseED += screening.gad2_anxiety * 6;
  }
  if (screening.pcptsd_nightmaresOrHyperarousal) {
    baseED += 15;
  }
  if (screening.cssrs_suicidalThoughts) {
    baseSH = Math.max(baseSH, 65);
  }
  if (screening.cssrs_suicidalPlan) {
    baseSH = Math.max(baseSH, 90);
  }

  // 3. Acoustic features (OpenSMILE eGeMAPS: max 15% contribution per spec)
  // Check flat affect + severe narrative pattern: caller sounds numb/stoic but narrative is severe!
  const isSevereNarrative = baseTH >= 65 || baseSH >= 65 || baseED >= 65;
  const isFlatAffect = acoustic.affectType === 'flat_numbed' || acoustic.jitterPercent < 0.8;

  let acousticAdjustment = 0;
  if (acoustic.affectType === 'agitated') {
    acousticAdjustment = 10; // modest boost
  } else if (isFlatAffect && isSevereNarrative) {
    // Crucial anti-masking design: flat affect + severe narrative = numbing trauma pattern!
    acousticAdjustment = 12;
  } else if (acoustic.affectType === 'flat_numbed') {
    acousticAdjustment = -3;
  }
  // Cap acoustic impact strictly at 15% (max +/- 15 points)
  acousticAdjustment = Math.max(-15, Math.min(15, acousticAdjustment));

  const ED = Math.min(100, Math.max(0, Math.round(baseED + acousticAdjustment * 0.4)));
  const SH = Math.min(100, Math.max(0, Math.round(baseSH)));
  const TH = Math.min(100, Math.max(0, Math.round(baseTH)));
  const SI = Math.min(100, Math.max(0, Math.round(baseSI)));

  const subScores: SubScores = { ED, SH, TH, SI };

  // 4. Formula:
  // Weighted mean W = 0.30·ED + 0.30·SH + 0.25·TH + 0.15·SI
  // Peak component M = max(ED, SH, TH, SI)
  // SVI (base) = round( 0.5·W + 0.5·M )
  const weightedMean = 0.30 * ED + 0.30 * SH + 0.25 * TH + 0.15 * SI;
  const peakComponent = Math.max(ED, SH, TH, SI);
  const baseSvi = Math.min(100, Math.max(0, Math.round(0.5 * weightedMean + 0.5 * peakComponent)));

  const baseCategory = getCategoryFromScore(baseSvi);
  let finalCategory = baseCategory;
  const overrides: OverrideTrigger[] = [];

  // 5. Hard-override rules (Deterministic & Auditable)
  // Rule 1: Suicidal intent/plan/means or SH >= 70
  if (SH >= 70 || screening.cssrs_suicidalPlan || lexiconHits.some(h => h.category === 'self_harm' && h.severity === 'critical')) {
    finalCategory = 'Critical';
    overrides.push({
      id: 'rule-sh-critical',
      ruleName: 'SH Override: Suicidal Risk Detected',
      forcedCategory: 'Critical',
      evidence: `Self-harm risk sub-score is ${SH}/100 with active suicidal ideation phrase detected in transcript.`,
      requiresWarmHandoff: true,
    });
  }

  // Rule 2: Imminent physical danger
  const hasImminentThreat = lexiconHits.some(h => h.category === 'threat' && h.severity === 'critical') ||
    textLower.includes('tonight') || textLower.includes('outside') || textLower.includes('bahaar') || textLower.includes('mar dalenge');
  if (hasImminentThreat && TH >= 65) {
    finalCategory = 'Critical';
    overrides.push({
      id: 'rule-threat-imminent',
      ruleName: 'Imminent Physical Danger Override',
      forcedCategory: 'Critical',
      evidence: 'Perpetrators present or nocturnal threat to life disclosed ("they will kill us / outside right now").',
      requiresEmergencyProtection: true,
    });
  }

  // Rule 3: Active retaliation threat with named perpetrators, TH >= 70
  if (TH >= 70 && !overrides.some(o => o.forcedCategory === 'Critical')) {
    finalCategory = maxCategory(finalCategory, 'High');
    overrides.push({
      id: 'rule-retaliation-high',
      ruleName: 'Active Retaliation / PoA Duress',
      forcedCategory: 'High',
      evidence: `External threat sub-score ${TH}/100 with pressure to withdraw FIR / compromise under threat.`,
    });
  }

  // Rule 4: Sexual violence in last 72h
  if (isSexualViolenceRecent) {
    finalCategory = maxCategory(finalCategory, 'High');
    overrides.push({
      id: 'rule-sexual-violence',
      ruleName: 'Recent Sexual Violence (<72h) Protocol',
      forcedCategory: 'High',
      evidence: 'Special PoA medical & forensic examination required within statutory 72h protocol window.',
    });
  }

  // Rule 5: Child or elderly or person with disability -> bumped by 1 level
  if (isMinorOrElderly && finalCategory !== 'Critical') {
    const prior = finalCategory;
    finalCategory = bumpCategory(finalCategory);
    overrides.push({
      id: 'rule-vulnerable-demographic',
      ruleName: 'Vulnerable Demographic Safeguard',
      forcedCategory: finalCategory,
      evidence: `Caller belongs to heightened vulnerability group (Minor/Elderly/PwD); category elevated from ${prior} to ${finalCategory}.`,
    });
  }

  // Rule 6: Fail-Up on Confidence < 0.5, ASR failure, or unsupported language
  if (confidence < 0.50 || asrFailed || unsupportedLanguage) {
    finalCategory = maxCategory(finalCategory, 'High');
    overrides.push({
      id: 'rule-fail-up',
      ruleName: 'Fail-Up Safety Principle',
      forcedCategory: 'High',
      evidence: `ASR/Model uncertainty detected (confidence: ${Math.round(confidence * 100)}%). Directing toward senior human counsellor, never away.`,
    });
  }

  // 6. Explanation bullets for human agent / counsellor
  const explanationBullets: string[] = [];
  if (overrides.length > 0) {
    overrides.forEach(o => explanationBullets.push(`[RULE TRIGGERED] ${o.ruleName}: ${o.evidence}`));
  }
  if (lexiconHits.length > 0) {
    explanationBullets.push(`Atrocity Lexicon matched: ${lexiconHits.map(h => `"${h.term}" (${h.category})`).join(', ')}`);
  }
  if (isFlatAffect && isSevereNarrative) {
    explanationBullets.push('Clinical Pattern: Flat vocal affect combined with severe narrative indicates trauma numbing / dissociation.');
  } else if (acoustic.affectType === 'agitated') {
    explanationBullets.push(`Acoustic Profile: Heightened vocal arousal (Pitch: ${acoustic.pitchHz}Hz, Jitter: ${acoustic.jitterPercent}%), supportive factor capped at 15%.`);
  }
  if (screening.cssrs_suicidalThoughts || screening.cssrs_suicidalPlan) {
    explanationBullets.push('Micro-Screening: Caller endorsed suicidal thoughts/plan on gentle anchor items.');
  }

  // 7. Suggested pathways based on Risk-to-Action Matrix (§6)
  const suggestedPathways: string[] = [];
  if (finalCategory === 'Critical') {
    suggestedPathways.push('Live warm handoff to on-duty crisis counsellor (SLA ≤ 15 min)');
    suggestedPathways.push('Tele-MANAS (14416) crisis psychiatric linkage');
    if (TH >= 70 || hasImminentThreat) {
      suggestedPathways.push('Urgent witness protection assessment & safe relocation check');
      suggestedPathways.push('Emergency 112 police dispatch request (minimal data only)');
    }
    suggestedPathways.push('Priority DLSA same-day legal aid mobilization');
  } else if (finalCategory === 'High') {
    suggestedPathways.push('Priority counsellor callback (SLA ≤ 4 h)');
    suggestedPathways.push('DLSA Priority Legal Aid for PoA relief entitlement');
    if (TH >= 50) {
      suggestedPathways.push('Witness Protection Assessment via District Nodal Officer');
    }
    suggestedPathways.push('Mental health clinical consultation scheduled');
  } else if (finalCategory === 'Moderate') {
    suggestedPathways.push('Counsellor supportive callback (SLA ≤ 48 h)');
    suggestedPathways.push('Legal aid and compensation application guidance');
    suggestedPathways.push('Referral to district social welfare officer');
  } else {
    suggestedPathways.push('Self-help psychoeducation resources delivered via SMS/App');
    suggestedPathways.push('Standard helpline PoA legal rights advisory');
  }

  return {
    sviScore: baseSvi,
    baseCategory,
    finalCategory,
    isOverridden: overrides.length > 0,
    overrides,
    subScores,
    confidence,
    weightedMean: Math.round(weightedMean),
    peakComponent: Math.round(peakComponent),
    explanationBullets,
    suggestedPathways,
    acousticContribution: acousticAdjustment,
    lexiconHits,
  };
}

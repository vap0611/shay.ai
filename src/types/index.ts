export type RiskLevel = 'Low' | 'Moderate' | 'High' | 'Critical';

export type LanguageCode = 'hi' | 'gu' | 'mr' | 'en';

export type IngestChannel = '14566_telephony' | 'ivrs' | 'app' | 'portal' | 'chatbot';

export type UserRole = 'psychosocial_counsellor' | 'district_nodal_officer' | 'police_officer' | 'system_auditor';

export interface AcousticFeatures {
  pitchHz: number;          // Baseline relative (e.g. 180 Hz)
  jitterPercent: number;    // Vocal instability
  shimmerPercent: number;   // Amplitude perturbation
  speechRateWpm: number;    // Words per min (fast = anxiety, very slow = depression/numb)
  pauseRatio: number;       // Ratio of silence to speech
  energyDb: number;         // Vocal intensity
  affectType: 'agitated' | 'baseline' | 'flat_numbed' | 'hesitant';
  contributionPct: number;  // Max 15% per specification
}

export interface SubScores {
  ED: number; // Emotional Distress (0-100)
  SH: number; // Self-harm Risk (0-100)
  TH: number; // External Threat & Retaliation (0-100)
  SI: number; // Isolation & Support Deficit (0-100)
}

export interface OverrideTrigger {
  id: string;
  ruleName: string;
  forcedCategory: RiskLevel;
  evidence: string;
  requiresWarmHandoff?: boolean;
  requiresEmergencyProtection?: boolean;
}

export interface LexiconHit {
  term: string;
  originalText: string;
  category: 'threat' | 'boycott' | 'caste_abuse' | 'self_harm' | 'retaliation' | 'vulnerability';
  severity: 'moderate' | 'severe' | 'critical';
  language: LanguageCode;
}

export interface SVIResult {
  sviScore: number;          // 0-100
  baseCategory: RiskLevel;
  finalCategory: RiskLevel;
  isOverridden: boolean;
  overrides: OverrideTrigger[];
  subScores: SubScores;
  confidence: number;        // 0-1.0
  weightedMean: number;
  peakComponent: number;
  explanationBullets: string[];
  suggestedPathways: string[];
  acousticContribution: number; // <= 15%
  lexiconHits: LexiconHit[];
}

export interface MicroScreeningAnswers {
  phq2_depressedMood: number; // 0-3
  phq2_anhedonia: number;    // 0-3
  gad2_anxiety: number;      // 0-3
  gad2_uncontrollableWorry: number; // 0-3
  pcptsd_nightmaresOrHyperarousal: boolean;
  cssrs_suicidalThoughts: boolean;
  cssrs_suicidalPlan: boolean;
}

export interface HelplineCase {
  id: string;
  callerAlias: string;
  district: string;
  state: string;
  language: LanguageCode;
  channel: IngestChannel;
  timestamp: string;
  lastContactDate: string;
  sviHistory: Array<{ date: string; score: number; category: RiskLevel; contactType: string }>;
  currentSVI: SVIResult;
  restrictedRouting: boolean; // For cases where perpetrators are locally powerful
  perpetratorInfluence: 'low' | 'local_panchayat' | 'locally_powerful_official' | 'organized_syndicate';
  consent: {
    analysisConsent: boolean;
    agencySharingConsent: boolean;
    verbalConsentLogged: boolean;
    emergencyExceptionActive: boolean;
  };
  reviewStatus: 'pending' | 'accepted' | 'modified' | 'rejected';
  reviewDetails?: {
    reviewedBy: string;
    reviewTimestamp: string;
    originalCategory: RiskLevel;
    assignedCategory: RiskLevel;
    decisionReason: string;
  };
  transcript: string;
  slaMinutesRemaining: number;
  slaBreached: boolean;
  microScreening?: Partial<MicroScreeningAnswers>;
}

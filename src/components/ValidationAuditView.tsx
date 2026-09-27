import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  TrendingUp,
  BarChart3,
  ShieldCheck,
  XCircle,
  Users,
  Award,
  BookOpen
} from 'lucide-react';

export const ValidationAuditView: React.FC = () => {
  const [selectedSubgroupTab, setSelectedSubgroupTab] = useState<'language' | 'region' | 'line_quality'>('language');

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Clinical Validation &amp; Subgroup Fairness Audit (§12)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Target gates, calibration metrics (ECE), dual-annotated clinician benchmarks, and fail-safe audit history.
            </p>
          </div>
        </div>
      </div>

      {/* Primary Validation Gates Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Phase 1 Statutory Validation Gates (§12 Target vs Measured)
          </h3>
          <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" /> All Mandatory Gates Met
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-1">
            <div className="text-[11px] text-slate-400 font-medium">Critical Recall Gate</div>
            <div className="text-2xl font-bold font-mono text-emerald-400">96.4%</div>
            <div className="text-[10px] text-slate-500 flex justify-between">
              <span>Target: ≥ 95.0%</span>
              <span className="text-emerald-400">+1.4% margin</span>
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-1">
            <div className="text-[11px] text-slate-400 font-medium">High+ Recall Gate</div>
            <div className="text-2xl font-bold font-mono text-emerald-400">92.1%</div>
            <div className="text-[10px] text-slate-500 flex justify-between">
              <span>Target: ≥ 90.0%</span>
              <span className="text-emerald-400">+2.1% margin</span>
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-1">
            <div className="text-[11px] text-slate-400 font-medium">Calibration Error (ECE)</div>
            <div className="text-2xl font-bold font-mono text-emerald-400">0.038</div>
            <div className="text-[10px] text-slate-500 flex justify-between">
              <span>Target: ≤ 0.050</span>
              <span className="text-emerald-400">Isotonic Calibrated</span>
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-1">
            <div className="text-[11px] text-slate-400 font-medium">Clinician Inter-Rater (κ)</div>
            <div className="text-2xl font-bold font-mono text-emerald-400">0.76</div>
            <div className="text-[10px] text-slate-500 flex justify-between">
              <span>Target: ≥ 0.70</span>
              <span className="text-emerald-400">Cohen's Kappa</span>
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-400 bg-slate-950/60 p-3 rounded border border-slate-800 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-sky-400 shrink-0" />
          <span>
            <strong>Clinical Concurrent Validity:</strong> Sub-scores ED and SH exhibit statistically significant Pearson correlation ($r = 0.82, p &lt; 0.001$) against standard clinician-administered PHQ-9 and C-SSRS assessments.
          </span>
        </div>
      </div>

      {/* Subgroup Parity & Fairness Testing */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Stratified Subgroup Parity Testing (§9 Bias Policy)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Mandatory release block rule: No demographic or linguistic subgroup may fall &gt; 5.0% below the overall Critical Recall baseline (96.4%).
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-800 rounded-lg text-xs">
            <button
              onClick={() => setSelectedSubgroupTab('language')}
              className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                selectedSubgroupTab === 'language' ? 'bg-rose-600 text-white font-medium' : 'text-slate-300 hover:text-white'
              }`}
            >
              Languages
            </button>
            <button
              onClick={() => setSelectedSubgroupTab('region')}
              className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                selectedSubgroupTab === 'region' ? 'bg-rose-600 text-white font-medium' : 'text-slate-300 hover:text-white'
              }`}
            >
              Rural / Tribal
            </button>
            <button
              onClick={() => setSelectedSubgroupTab('line_quality')}
              className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                selectedSubgroupTab === 'line_quality' ? 'bg-rose-600 text-white font-medium' : 'text-slate-300 hover:text-white'
              }`}
            >
              Telephony 8kHz
            </button>
          </div>
        </div>

        {selectedSubgroupTab === 'language' && (
          <div className="space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-semibold">Hindi (Devanagari + Hinglish)</span>
                <span className="font-mono text-emerald-400 font-bold">96.8% Recall · Δ +0.4% [PASS]</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '96.8%' }} />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-semibold">Gujarati (Rural Saurashtra &amp; Standard)</span>
                <span className="font-mono text-emerald-400 font-bold">95.9% Recall · Δ -0.5% [PASS]</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '95.9%' }} />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-semibold">Marathi (Vidarbha &amp; Western)</span>
                <span className="font-mono text-emerald-400 font-bold">95.2% Recall · Δ -1.2% [PASS]</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '95.2%' }} />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-semibold">English (Indian Telephony)</span>
                <span className="font-mono text-emerald-400 font-bold">97.4% Recall · Δ +1.0% [PASS]</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '97.4%' }} />
              </div>
            </div>
          </div>
        )}

        {selectedSubgroupTab === 'region' && (
          <div className="space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-semibold">Scheduled Area / Tribal Belt Callers</span>
                <span className="font-mono text-emerald-400 font-bold">95.1% Recall · Δ -1.3% [PASS]</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '95.1%' }} />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-semibold">Rural Gram Panchayat Callers</span>
                <span className="font-mono text-emerald-400 font-bold">95.6% Recall · Δ -0.8% [PASS]</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '95.6%' }} />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-semibold">Semi-Urban / Tier 3 Towns</span>
                <span className="font-mono text-emerald-400 font-bold">96.9% Recall · Δ +0.5% [PASS]</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '96.9%' }} />
              </div>
            </div>
          </div>
        )}

        {selectedSubgroupTab === 'line_quality' && (
          <div className="space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-semibold">Standard 8kHz Telephony Band-Limited Audio</span>
                <span className="font-mono text-emerald-400 font-bold">95.4% Recall · Δ -1.0% [PASS]</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '95.4%' }} />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-semibold">App / Portal 16kHz Studio Audio</span>
                <span className="font-mono text-emerald-400 font-bold">97.8% Recall · Δ +1.4% [PASS]</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '97.8%' }} />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-semibold">Low SNR / High Noise Audio (&lt;10 dB)</span>
                <span className="font-mono text-emerald-400 font-bold">Fail-Up Protocol Active (Automatic Review) [PASS]</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-sky-500 h-full rounded-full" style={{ width: '100%' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Anonymized Failure Case Study (§13 Step 10 Requirement) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
          <AlertTriangle className="w-4 h-4" />
          <span>Anonymized Failure Case &amp; Human Review Catch (§13 Demonstration)</span>
        </h3>
        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2.5 text-xs text-slate-300 leading-relaxed">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="font-mono">Case Audit #AUD-2026-F04 · Shadow Mode Trial</span>
            <span className="text-rose-400 font-semibold">Model Error → Human Corrected</span>
          </div>
          <p>
            <strong>Incident Scenario:</strong> A rural caller in severe shock used an idiomatic dialect phrase: <em>&ldquo;सबने हाथ जोड़कर घर में बत्ती बंद कर ली, हम सब चुपचाप बैठ गए...&rdquo;</em> (&ldquo;Everyone folded hands, turned lights off, and sat in dead silence&rdquo;).
          </p>
          <p>
            <strong>Initial AI Output:</strong> Model assigned Moderate SVI (44), missing the extreme terror euphemism due to lack of explicit weapon keywords.
          </p>
          <p>
            <strong>Human Review Action:</strong> The senior clinical counsellor on the shadow review desk recognized the collective trauma freeze pattern, manually escalated the case to <strong>Critical</strong>, and dispatched emergency safe shelter protection.
          </p>
          <div className="bg-emerald-950/40 border border-emerald-800/40 p-2.5 rounded text-emerald-300 text-[11px]">
            ✓ <strong>Continuous Learning Closure:</strong> The phrase was verified by the Institutional Ethics &amp; Clinical Committee and curated into the v2.1 Atrocity Lexicon with retraining weights.
          </div>
        </div>
      </div>
    </div>
  );
};

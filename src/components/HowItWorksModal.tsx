import React, { useState } from 'react';
import {
  X,
  PhoneCall,
  Activity,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  Lock,
  Stethoscope,
  Users,
  CheckCircle2,
  FileText,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Award
} from 'lucide-react';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: string) => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
}) => {
  const [activeStep, setActiveStep] = useState<number>(0);

  if (!isOpen) return null;

  const steps = [
    {
      id: 'flow',
      title: '1. End-to-End Operational Pipeline',
      badge: 'Architecture',
      description: 'How a call flows from inbound telephony to safe resolution under statutory supervision.',
      content: (
        <div className="space-y-4">
          <p className="text-xs text-slate-300 leading-relaxed">
            SAHAY-AI v2 operates as an <strong>assistive clinical decision-support layer</strong> for the National Helpline Against Atrocities (NHAA 14566) under the Ministry of Social Justice &amp; Empowerment. It does not replace human judgement or automate legal decisions.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
                <PhoneCall className="w-4 h-4" />
                <span>Step 1: Inbound &amp; IVR</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Caller dials 14566. An automated ~20s IVR explains assistive AI analysis in Hindi, Gujarati, or English. Pressing 1 accepts; pressing 2 guarantees standard human service with zero penalty.
              </p>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-sky-400 font-bold text-xs">
                <Activity className="w-4 h-4" />
                <span>Step 2: Tri-Channel Fusion</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Live speech is evaluated through 3 channels: A (Narrative &amp; Lexicon), B (Micro-Screening anchors), and C (Acoustic prosody capped at ≤15%). Computes SVI score (0–100).
              </p>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                <ShieldAlert className="w-4 h-4" />
                <span>Step 3: Human-in-the-Loop</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Critical cases enforce a 30s supervisor safety timer. The counsellor inspects the SVI, overrides rules if needed, and logs a mandatory justification to accept, modify, or reject.
              </p>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>Step 4: Safe Resolution</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                1-click warm handoff to Tele-MANAS (14416) or legal aid (DLSA). Data is firewalled: police and administrative desks never see clinical scores or trauma narratives.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'formula',
      title: '2. The SVI Formulation & Hard Overrides',
      badge: 'Clinical Engine',
      description: 'The mathematical formulation of the Stress Vulnerability Index and fail-safe clinical overrides.',
      content: (
        <div className="space-y-4">
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-3 font-mono text-xs">
            <div className="text-slate-400 font-sans font-semibold text-xs text-white">
              Composite Mathematical Formulation:
            </div>
            <div className="bg-slate-900/80 p-3 rounded border border-slate-800 text-rose-300">
              W = 0.30 · ED + 0.30 · SH + 0.25 · TH + 0.15 · SI
            </div>
            <div className="bg-slate-900/80 p-3 rounded border border-slate-800 text-sky-300">
              SVI = round(0.5 · W + 0.5 · M)
            </div>
            <div className="text-[11px] text-slate-400 font-sans leading-relaxed">
              Where <strong className="text-slate-200">ED</strong> = Emotional Distress, <strong className="text-slate-200">SH</strong> = Self-Harm &amp; Helplessness, <strong className="text-slate-200">TH</strong> = Threat &amp; Fear, <strong className="text-slate-200">SI</strong> = Social Isolation, and <strong className="text-slate-200">M</strong> = Clinical Micro-Screening anchor (PHQ-2, GAD-2, PC-PTSD-5, C-SSRS).
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-1.5">
              <div className="font-bold text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                <span>Deterministic Hard Override Rules</span>
              </div>
              <ul className="text-[11px] text-slate-400 space-y-1 list-disc pl-4">
                <li><strong className="text-rose-400">Rule 1:</strong> SH score ≥ 70 or active suicidal intent → Force Critical (SVI = 95).</li>
                <li><strong className="text-rose-400">Rule 2:</strong> Imminent physical danger / active perpetrators present → Force Critical.</li>
                <li><strong className="text-rose-400">Rule 3:</strong> Sexual violence within 72 hours → Force Critical (medico-legal SLA).</li>
                <li><strong className="text-rose-400">Rule 4:</strong> Vulnerable intersectionality (minor, pregnant, elderly) + high threat → Bump +1 tier.</li>
              </ul>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-1.5">
              <div className="font-bold text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>Fail-Safe Acoustic &amp; Noise Rules</span>
              </div>
              <ul className="text-[11px] text-slate-400 space-y-1 list-disc pl-4">
                <li><strong className="text-amber-400">Trauma Dissociation Guard:</strong> Flat monotone vocal affect with severe text triggers critical dissociation alert.</li>
                <li><strong className="text-amber-400">Acoustic Guardrail:</strong> Prosodic features capped strictly at ≤15% total weight.</li>
                <li><strong className="text-amber-400">Fail-Up Protocol:</strong> Low ASR confidence (&lt;0.50), unsupported dialect, or audio failure automatically escalates to mandatory human review.</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'firewall',
      title: '3. Legal-Rights Firewall & Privacy (§9)',
      badge: 'Legal Safeguards',
      description: 'Physical & logical isolation guaranteeing victim rights under the SC/ST (PoA) Act 1989 & DPDP Act 2023.',
      content: (
        <div className="space-y-4 text-xs">
          <div className="bg-rose-950/20 border border-rose-800/40 p-4 rounded-lg space-y-2">
            <div className="font-bold text-rose-300 flex items-center gap-2">
              <Lock className="w-4 h-4 text-rose-400" />
              <span>Statutory Legal-Rights Decoupling Mandate</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              The SVI score and psychosocial notes are stored in a logically and physically isolated clinical enclave. <strong>The SVI is strictly forbidden from gating, delaying, or influencing:</strong>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 font-mono text-[10px]">
              <div className="bg-slate-900/90 p-2 rounded border border-rose-900/40 text-slate-300">
                1. Statutory FIR Registration (Section 4 PoA Act)
              </div>
              <div className="bg-slate-900/90 p-2 rounded border border-rose-900/40 text-slate-300">
                2. Immediate Relief &amp; Compensation (Rule 12)
              </div>
              <div className="bg-slate-900/90 p-2 rounded border border-rose-900/40 text-slate-300">
                3. Court Priority / Legal Aid Entitlement
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-2">
              <span className="font-bold text-white text-xs">Tiered Role Visibility</span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Central counsellors have full clinical visibility. District nodal officers see only categorical bands. Police officers are completely firewalled—they only receive logistical dispatch instructions.
              </p>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-2">
              <span className="font-bold text-white text-xs">Retaliation-Aware Restricted Routing</span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                When perpetrators include local police or political figures, the case bypasses local police stations and gram panchayats, routing directly to the State Nodal Officer (ADGP Human Rights).
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'demo',
      title: '4. How to Test & Demo Each Feature in this App',
      badge: 'Interactive Tour',
      description: 'Quick guide to exploring the interactive features across each tab in this interface.',
      content: (
        <div className="space-y-3 text-xs">
          <p className="text-slate-300 leading-relaxed">
            You can test the entire workflow right now using the tabs in the top navigation:
          </p>

          <div className="space-y-2">
            <div
              onClick={() => {
                onNavigateTab('assist');
                onClose();
              }}
              className="bg-slate-950 hover:bg-slate-800/80 p-3 rounded-lg border border-slate-800 cursor-pointer transition-colors flex items-center justify-between"
            >
              <div>
                <span className="font-bold text-rose-400">1. Live Helpline Assist:</span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Pick a preloaded scenario (e.g. Village Social Boycott, Immediate Life Threat, or Audio Distortion). Click <strong>&ldquo;Play Scenario&rdquo;</strong> to watch live ASR, acoustic prosody, rolling SVI calculation, and the 30s supervisor safety countdown.
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 ml-3" />
            </div>

            <div
              onClick={() => {
                onNavigateTab('queue');
                onClose();
              }}
              className="bg-slate-950 hover:bg-slate-800/80 p-3 rounded-lg border border-slate-800 cursor-pointer transition-colors flex items-center justify-between"
            >
              <div>
                <span className="font-bold text-rose-400">2. Counsellor Queue:</span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  View statutory SLA timers (Critical ≤15m, High ≤4h). Click any case to inspect multi-contact SVI trajectories, review override rules, and perform an audit decision (Accept, Modify, Reject).
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 ml-3" />
            </div>

            <div
              onClick={() => {
                onNavigateTab('consent');
                onClose();
              }}
              className="bg-slate-950 hover:bg-slate-800/80 p-3 rounded-lg border border-slate-800 cursor-pointer transition-colors flex items-center justify-between"
            >
              <div>
                <span className="font-bold text-rose-400">3. Consent Gateway:</span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Experience the 20-second IVR prompt in Hindi, Gujarati, or English. Test pressing 1 vs 2 to verify the zero-penalty guarantee.
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 ml-3" />
            </div>

            <div
              onClick={() => {
                onNavigateTab('screening');
                onClose();
              }}
              className="bg-slate-950 hover:bg-slate-800/80 p-3 rounded-lg border border-slate-800 cursor-pointer transition-colors flex items-center justify-between"
            >
              <div>
                <span className="font-bold text-rose-400">4. Micro-Screening:</span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Try answering the PHQ-2, GAD-2, and C-SSRS trauma screener to observe how clinical anchors ground the SVI engine.
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 ml-3" />
            </div>

            <div
              onClick={() => {
                onNavigateTab('rbac');
                onClose();
              }}
              className="bg-slate-950 hover:bg-slate-800/80 p-3 rounded-lg border border-slate-800 cursor-pointer transition-colors flex items-center justify-between"
            >
              <div>
                <span className="font-bold text-rose-400">5. Privacy &amp; RBAC Simulator:</span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Switch between Counsellor, District Nodal Officer, and Police Officer roles in the top bar to observe field-level redactions and restricted routing.
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 ml-3" />
            </div>

            <div
              onClick={() => {
                onNavigateTab('audit');
                onClose();
              }}
              className="bg-slate-950 hover:bg-slate-800/80 p-3 rounded-lg border border-slate-800 cursor-pointer transition-colors flex items-center justify-between"
            >
              <div>
                <span className="font-bold text-rose-400">6. Validation &amp; Audit:</span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Inspect empirical validation metrics (Critical Recall 96.4%, ECE 0.038), language parity tests, and the shadow-mode failure case study.
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 ml-3" />
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 shadow-2xl relative space-y-5 my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600/20 text-rose-400 flex items-center justify-center font-bold text-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                How SAHAY-AI v2 Works: System Architecture &amp; Guide
              </h2>
              <p className="text-xs text-slate-400">
                Psychosocial Vulnerability Triage Layer for the National Helpline Against Atrocities (14566)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Selector Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl overflow-x-auto border border-slate-800">
          {steps.map((step, idx) => (
            <button
              key={step.id}
              onClick={() => setActiveStep(idx)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeStep === idx
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span>{step.title.split('.')[1] || step.title}</span>
            </button>
          ))}
        </div>

        {/* Step Body */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>{steps[activeStep].title}</span>
              <span className="text-[10px] bg-slate-800 text-slate-300 font-mono px-2 py-0.5 rounded">
                {steps[activeStep].badge}
              </span>
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              Step {activeStep + 1} of {steps.length}
            </span>
          </div>
          <p className="text-xs text-slate-400">
            {steps[activeStep].description}
          </p>
        </div>

        {/* Active Tab Content */}
        <div className="bg-slate-900/50 rounded-xl">
          {steps[activeStep].content}
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            disabled={activeStep === 0}
            onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
            className="py-1.5 px-3 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

          <div className="flex items-center gap-2">
            {activeStep < steps.length - 1 ? (
              <button
                onClick={() => setActiveStep((prev) => Math.min(steps.length - 1, prev + 1))}
                className="py-1.5 px-4 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="py-1.5 px-4 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer"
              >
                Got it, Start Exploring!
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

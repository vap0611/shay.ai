import React, { useState } from 'react';
import {
  ShieldCheck,
  PhoneCall,
  Lock,
  CheckCircle2,
  XCircle,
  Volume2,
  AlertTriangle,
  RotateCcw,
  FileCheck
} from 'lucide-react';

interface ConsentGatewayProps {
  onConsentChange?: (consent: { analysisConsent: boolean; sharingConsent: boolean }) => void;
}

export const ConsentGateway: React.FC<ConsentGatewayProps> = ({ onConsentChange }) => {
  const [selectedLanguage, setSelectedLanguage] = useState<'hi' | 'gu' | 'en'>('hi');
  const [ivrStep, setIvrStep] = useState<'idle' | 'playing_prompt' | 'accepted' | 'refused'>('idle');
  const [analysisConsent, setAnalysisConsent] = useState<boolean>(true);
  const [sharingConsent, setSharingConsent] = useState<boolean>(false);
  const [verbalLogged, setVerbalLogged] = useState<boolean>(true);
  const [emergencyOverrideActive, setEmergencyOverrideActive] = useState<boolean>(false);

  const audioPrompts = {
    hi: {
      text: 'हमारे काउंसलर आपकी बेहतर सहायता कर सकें, इसके लिए हम एक सहायक टूल का उपयोग करना चाहते हैं जो आपकी आवाज़ और शब्दों का विश्लेषण करता है। एक मानव काउंसलर हमेशा इसकी समीक्षा करेगा। अनुमति देने के लिए 1 दबाएं, बिना इसके जारी रखने के लिए 2 दबाएं।',
      phonetic: 'IVR Prompt in Hindi (Telephony 8kHz standard notification)',
    },
    gu: {
      text: 'અમારા કાઉન્સિલર તમારી વધુ સારી રીતે સહાય કરી શકે તે માટે, અમે એક સહાયક ટૂલનો ઉપયોગ કરવા માંગીએ છીએ જે તમારા અવાજ અને શબ્દોનું વિશ્લેષણ કરશે. હંમેશા એક વ્યક્તિ તેની સમીક્ષા કરશે. મંજૂરી આપવા માટે 1 દબાવો, તેના વિના આગળ વધવા માટે 2 દબાવો.',
      phonetic: 'IVR Prompt in Gujarati (Telephony standard notification)',
    },
    en: {
      text: 'To help our counsellors support you better, we would like to use an assistive tool that analyses your voice and words. A person will always review it. Press 1 to allow, press 2 to continue without it.',
      phonetic: 'IVR Prompt in English (National helpline standard notification)',
    },
  };

  const handleSimulateKey = (key: '1' | '2') => {
    if (key === '1') {
      setIvrStep('accepted');
      setAnalysisConsent(true);
      if (onConsentChange) onConsentChange({ analysisConsent: true, sharingConsent });
    } else {
      setIvrStep('refused');
      setAnalysisConsent(false);
      if (onConsentChange) onConsentChange({ analysisConsent: false, sharingConsent: false });
    }
  };

  const toggleAnalysis = () => {
    const next = !analysisConsent;
    setAnalysisConsent(next);
    if (onConsentChange) onConsentChange({ analysisConsent: next, sharingConsent });
  };

  const toggleSharing = () => {
    const next = !sharingConsent;
    setSharingConsent(next);
    if (onConsentChange) onConsentChange({ analysisConsent, sharingConsent: next });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Consent Gateway &amp; Privacy Safeguards (§9)
            </h2>
            <p className="text-xs text-slate-400">
              Granular consent architecture under Digital Personal Data Protection (DPDP) Act 2023 &amp; PoA Rules.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive IVR Telephony Consent Simulation */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-rose-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Interactive IVR Audio Consent Demonstration
            </h3>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400">Audio Language:</span>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value as any)}
              className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200"
            >
              <option value="hi">Hindi (हिन्दी)</option>
              <option value="gu">Gujarati (ગુજરાતી)</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>

        {/* IVR Announcement Box */}
        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <PhoneCall className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>14566 Inbound Telephony Automated Announcement (~20s)</span>
          </div>

          <p className="text-xs text-slate-200 leading-relaxed italic bg-slate-900/60 p-3 rounded border border-slate-800">
            &ldquo;{audioPrompts[selectedLanguage].text}&rdquo;
          </p>

          {/* Interactive Dialpad simulation */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleSimulateKey('1')}
                className="py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <span>[Press 1]</span>
                <span>Allow Assistive Analysis</span>
              </button>

              <button
                onClick={() => handleSimulateKey('2')}
                className="py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-2 border border-slate-700 transition-colors cursor-pointer"
              >
                <span>[Press 2]</span>
                <span>Continue Without Analysis</span>
              </button>
            </div>

            <button
              onClick={() => {
                setIvrStep('idle');
                setAnalysisConsent(true);
              }}
              className="text-slate-500 hover:text-slate-300 text-xs flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset IVR</span>
            </button>
          </div>
        </div>

        {/* Dynamic Outcome Display */}
        {ivrStep === 'accepted' && (
          <div className="bg-emerald-950/30 border border-emerald-700/50 rounded-lg p-4 text-xs text-emerald-200 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-emerald-300 text-sm">
                Assistive AI Analysis Permitted
              </div>
              <p className="mt-1 leading-relaxed">
                Caller opted-in to real-time speech and transcript vulnerability assistance. The SVI layer operates during the call, with human counsellor review required before any agency referral.
              </p>
            </div>
          </div>
        )}

        {ivrStep === 'refused' && (
          <div className="bg-slate-800/80 border border-slate-700 rounded-lg p-4 text-xs text-slate-300 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-amber-400 text-sm">
              <XCircle className="w-5 h-5 text-amber-400" />
              <span>Zero-Penalty Guarantee (§9 Compliance Verified)</span>
            </div>
            <p className="leading-relaxed">
              <strong>The caller chose not to use AI analysis.</strong> Per strict ethical charter, the helpline call continues with standard human service without any delay, gating, penalty, or downgrading. No audio or transcript analysis is performed.
            </p>
            <div className="text-[11px] bg-slate-900 p-2.5 rounded border border-slate-800 text-slate-400">
              ✓ Call placed in standard human counsellor queue with normal priority.<br />
              ✓ Statutory FIR, relief, and DLSA entitlements remain fully accessible.
            </div>
          </div>
        )}
      </div>

      {/* Two-Separate-Consents Matrix */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
          Two-Separate-Consents Architecture (§9 Mandate)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Consent 1: Assistive Analysis */}
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Consent 1: Assistive AI Analysis</span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                  analysisConsent ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                }`}>
                  {analysisConsent ? 'ACTIVE' : 'REVOKED'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Permits real-time speech recognition, acoustic prosodic calibration (≤15%), and rolling Stress Vulnerability Index computation on the human agent’s screen.
              </p>
            </div>
            <button
              onClick={toggleAnalysis}
              className={`py-1.5 px-3 rounded text-xs font-semibold transition-colors cursor-pointer ${
                analysisConsent ? 'bg-rose-900/60 hover:bg-rose-800 text-rose-200 border border-rose-700' : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              {analysisConsent ? 'Revoke Analysis Consent' : 'Grant Analysis Consent'}
            </button>
          </div>

          {/* Consent 2: Inter-Agency Data Sharing */}
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Consent 2: Inter-Agency Sharing</span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                  sharingConsent ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
                }`}>
                  {sharingConsent ? 'CONSENTED' : 'RESTRICTED'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Authorizes sharing of vetted action requests with DLSA (legal aid), medical officers, or protection nodal officers. Raw psychosocial notes and SVI scores are never shared.
              </p>
            </div>
            <button
              onClick={toggleSharing}
              className={`py-1.5 px-3 rounded text-xs font-semibold transition-colors cursor-pointer ${
                sharingConsent ? 'bg-rose-900/60 hover:bg-rose-800 text-rose-200 border border-rose-700' : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              {sharingConsent ? 'Restrict Agency Sharing' : 'Consent to Referral Sharing'}
            </button>
          </div>
        </div>

        {/* Emergency Life-Safety Exception Banner */}
        <div className="bg-amber-950/20 border border-amber-800/40 rounded-lg p-4 text-xs text-slate-300 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-300 font-semibold">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Emergency Life-Safety Exception (§9 DPDP Clause)</span>
            </div>
            <button
              onClick={() => setEmergencyOverrideActive(!emergencyOverrideActive)}
              className="text-[11px] text-amber-400 underline hover:text-amber-300"
            >
              {emergencyOverrideActive ? 'Simulate Deactivation' : 'Simulate Imminent Life Risk Trigger'}
            </button>
          </div>
          <p className="leading-relaxed">
            Strictly limited to scenarios of imminent danger to life or immediate self-harm in progress. In such emergencies, minimum necessary logistical dispatch is permitted and subjected to mandatory post-incident ethical review.
          </p>
          {emergencyOverrideActive && (
            <div className="bg-amber-900/30 border border-amber-700/60 p-2.5 rounded font-mono text-[11px] text-amber-200">
              [SYSTEM LOG] Emergency Exception Invoked for Incident #EM-2026-9901 · Narrow police welfare check dispatched · Logged for DPDP compliance audit.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

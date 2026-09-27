import React, { useState, useEffect } from 'react';
import { PhoneCall, ShieldAlert, CheckCircle2, UserCheck, X, Volume2, PhoneForwarded } from 'lucide-react';
import { HelplineCase } from '../types';

interface WarmHandoffModalProps {
  caseData: HelplineCase;
  isOpen: boolean;
  onClose: () => void;
  onHandoffComplete: (target: string) => void;
}

export const WarmHandoffModal: React.FC<WarmHandoffModalProps> = ({
  caseData,
  isOpen,
  onClose,
  onHandoffComplete,
}) => {
  const [handoffStep, setHandoffStep] = useState<'selecting' | 'dialing' | 'connected'>('selecting');
  const [targetService, setTargetService] = useState<'telemanas' | 'onduty_counsellor' | 'emergency112'>('telemanas');
  const [secondsConnecting, setSecondsConnecting] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (handoffStep === 'dialing') {
      timer = setInterval(() => {
        setSecondsConnecting((prev) => {
          if (prev >= 3) {
            setHandoffStep('connected');
            clearInterval(timer);
            return 3;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [handoffStep]);

  if (!isOpen) return null;

  const handleInitiate = (target: 'telemanas' | 'onduty_counsellor' | 'emergency112') => {
    setTargetService(target);
    setHandoffStep('dialing');
    setSecondsConnecting(0);
  };

  const handleFinish = () => {
    const label = targetService === 'telemanas' 
      ? 'Tele-MANAS (14416) Suicide Prevention Node' 
      : targetService === 'onduty_counsellor' 
      ? 'On-Duty Senior Crisis Counsellor' 
      : '112 Emergency Dispatch (Minimum Data)';
    onHandoffComplete(label);
    onClose();
    setHandoffStep('selecting');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-w-xl w-full p-6 text-slate-100">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Live Warm Handoff Protocol</h3>
              <p className="text-xs text-slate-400">Caller: {caseData.callerAlias} · Case: {caseData.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {handoffStep === 'selecting' && (
          <div className="py-4 space-y-4">
            <div className="bg-rose-950/30 border border-rose-800/40 rounded-lg p-3 text-xs text-rose-200 leading-relaxed">
              <span className="font-semibold text-rose-300">Mandatory Rule (§7 &amp; §8):</span> The caller must remain on the line throughout. Never drop the caller into an unattended hold queue. An agent remains on 3-way bridge until clinical counsellor establishes verbal contact.
            </div>

            <div className="space-y-2.5">
              <div
                onClick={() => handleInitiate('telemanas')}
                className="p-3.5 rounded-lg border border-slate-700 bg-slate-800/60 hover:bg-slate-800 hover:border-rose-500 cursor-pointer transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <PhoneForwarded className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white group-hover:text-rose-300">
                      Tele-MANAS (14416) Crisis Node
                    </h4>
                    <p className="text-xs text-slate-400">
                      National Mental Health Helpline · Dedicated suicide crisis team · 24x7
                    </p>
                  </div>
                </div>
                <span className="text-xs font-medium text-emerald-400">Connect Now →</span>
              </div>

              <div
                onClick={() => handleInitiate('onduty_counsellor')}
                className="p-3.5 rounded-lg border border-slate-700 bg-slate-800/60 hover:bg-slate-800 hover:border-rose-500 cursor-pointer transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded bg-sky-500/10 text-sky-400 flex items-center justify-center">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white group-hover:text-sky-300">
                      On-Duty Senior NHAA Counsellor
                    </h4>
                    <p className="text-xs text-slate-400">
                      Specialized in caste-based violence, trauma de-escalation &amp; PoA legal relief
                    </p>
                  </div>
                </div>
                <span className="text-xs font-medium text-sky-400">Bridge Call →</span>
              </div>

              {caseData.currentSVI.overrides.some(o => o.requiresEmergencyProtection) && (
                <div
                  onClick={() => handleInitiate('emergency112')}
                  className="p-3.5 rounded-lg border border-amber-800/50 bg-amber-950/20 hover:bg-amber-950/40 hover:border-amber-500 cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded bg-amber-500/10 text-amber-400 flex items-center justify-center">
                      <PhoneCall className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-amber-300">
                        112 Police Emergency Dispatch Link
                      </h4>
                      <p className="text-xs text-slate-400">
                        Imminent nocturnal threat · Dispatch with minimum logistics only (No SVI/narrative shared)
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-amber-400">Dispatch Check →</span>
                </div>
              )}
            </div>

            <div className="pt-2 text-xs text-slate-400">
              <span className="font-semibold text-slate-300">Trauma-Informed Bridging Script:</span>
              <p className="italic text-slate-300 mt-1 bg-slate-800/40 p-2.5 rounded border border-slate-800">
                &ldquo;सुनीता जी, मैं आपके साथ लाइन पर हूँ और रहूँगा। मैं हमारी वरिष्ठ साथी काउंसलर को भी इस कॉल पर जोड़ रहा हूँ ताकि हम सब मिलकर आपकी सुरक्षा सुनिश्चित कर सकें। कृपया लाइन पर बने रहें।&rdquo;
              </p>
            </div>
          </div>
        )}

        {handoffStep === 'dialing' && (
          <div className="py-8 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center animate-pulse">
              <PhoneCall className="w-7 h-7 animate-bounce" />
            </div>
            <div>
              <h4 className="text-base font-semibold text-white">
                Initiating 3-Way Encrypted Bridge...
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Connecting to {targetService === 'telemanas' ? 'Tele-MANAS 14416' : 'Senior Counsellor Desk'}
              </p>
              <div className="text-xs font-mono text-rose-400 mt-2">
                00:0{secondsConnecting} / 00:03
              </div>
            </div>
          </div>
        )}

        {handoffStep === 'connected' && (
          <div className="py-6 space-y-4 text-center">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-base font-semibold text-white">
                3-Way Bridge Active
              </h4>
              <p className="text-xs text-slate-300 mt-1">
                Clinician connected: <span className="text-emerald-400 font-semibold">Dr. A. Verma (Tele-MANAS Node Bangalore)</span>
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Handshake verified · Psychosocial minimal context transferred securely.
              </p>
            </div>
            <div className="pt-3">
              <button
                onClick={handleFinish}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold tracking-wide transition-colors"
              >
                Complete Handoff &amp; Log Audit Entry
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

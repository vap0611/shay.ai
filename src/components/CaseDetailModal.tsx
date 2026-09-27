import React, { useState } from 'react';
import { HelplineCase, RiskLevel, UserRole } from '../types';
import {
  X,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Shield,
  Clock,
  FileText,
  User,
  MapPin,
  Lock,
  ArrowRight,
  Send,
  EyeOff,
  Navigation
} from 'lucide-react';
import { ResourceLocatorModal } from './ResourceLocatorModal';

interface CaseDetailModalProps {
  caseItem: HelplineCase;
  isOpen: boolean;
  onClose: () => void;
  activeRole: UserRole;
  onUpdateCase: (updated: HelplineCase) => void;
  onOpenWarmHandoff?: () => void;
}

export const CaseDetailModal: React.FC<CaseDetailModalProps> = ({
  caseItem,
  isOpen,
  onClose,
  activeRole,
  onUpdateCase,
  onOpenWarmHandoff,
}) => {
  const [actionType, setActionType] = useState<'accept' | 'modify' | 'reject' | null>(null);
  const [modifiedCategory, setModifiedCategory] = useState<RiskLevel>(caseItem.currentSVI.finalCategory);
  const [decisionReason, setDecisionReason] = useState('');
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);
  const [isResourceLocatorOpen, setIsResourceLocatorOpen] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleDecisionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!decisionReason.trim()) return;

    const assignedCategory = actionType === 'modify' ? modifiedCategory : caseItem.currentSVI.finalCategory;
    const updatedCase: HelplineCase = {
      ...caseItem,
      reviewStatus: actionType === 'accept' ? 'accepted' : actionType === 'modify' ? 'modified' : 'rejected',
      reviewDetails: {
        reviewedBy: 'Authorized Reviewer (' + activeRole.replace(/_/g, ' ') + ')',
        reviewTimestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
        originalCategory: caseItem.currentSVI.finalCategory,
        assignedCategory,
        decisionReason: decisionReason.trim(),
      }
    };

    onUpdateCase(updatedCase);
    setSubmittedMessage(`Decision logged successfully: ${actionType?.toUpperCase()} with audit record.`);
    setTimeout(() => {
      setSubmittedMessage(null);
      setActionType(null);
    }, 2000);
  };

  const svi = caseItem.currentSVI;
  const isPoliceRole = activeRole === 'police_officer';
  const isDistrictNodal = activeRole === 'district_nodal_officer';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-w-4xl w-full my-8 max-h-[90vh] flex flex-col text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${
              svi.finalCategory === 'Critical' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' :
              svi.finalCategory === 'High' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
              svi.finalCategory === 'Moderate' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40' :
              'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
            }`}>
              {isPoliceRole ? 'REQ' : svi.sviScore}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">{caseItem.callerAlias}</h3>
                <span className="text-xs text-slate-400 font-mono">[{caseItem.id}]</span>
                {caseItem.restrictedRouting && (
                  <span className="text-[11px] font-semibold bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30">
                    Restricted Routing: State Nodal
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {caseItem.district}, {caseItem.state}</span>
                <span>·</span>
                <span>Channel: {caseItem.channel.replace(/_/g, ' ')}</span>
                <span>·</span>
                <span className="font-mono">{caseItem.timestamp}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsResourceLocatorOpen(true)}
              className="px-2.5 py-1.5 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Open Nearby Legal Aid & Shelters Directory"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Legal Aid &amp; Shelters</span>
            </button>

            <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* POLICE FIREWALL NOTICE IF POLICE ROLE */}
          {isPoliceRole ? (
            <div className="bg-amber-950/20 border border-amber-700/40 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2 text-amber-300 text-sm font-semibold">
                <EyeOff className="w-4 h-4 text-amber-400" />
                <span>Statutory Firewall Active (DPDP Act 2023 &amp; PoA Rules)</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                As a designated police liaison, you receive only the minimum necessary logistical information for approved protection requests. The SVI numerical score, psychosocial clinical notes, and raw distress transcript are strictly firewalled in the separate NHAA psychosocial store and cannot be read or used in FIR prosecution.
              </p>
              <div className="bg-slate-900 p-3 rounded border border-slate-800 space-y-1.5 text-xs">
                <div className="text-slate-400"><span className="text-slate-200 font-semibold">Approved Action:</span> Urgent Witness Protection Assessment</div>
                <div className="text-slate-400"><span className="text-slate-200 font-semibold">Location Sector:</span> Bastipada, Taluka {caseItem.district}</div>
                <div className="text-slate-400"><span className="text-slate-200 font-semibold">Urgency Level:</span> High / Immediate Patrol Check</div>
                <div className="text-slate-400"><span className="text-slate-200 font-semibold">Authorized Officer:</span> Sub-Divisional Police Officer (Special PoA Cell)</div>
              </div>
            </div>
          ) : (
            <>
              {/* SVI Trend Timeline */}
              <div className="bg-slate-800/40 border border-slate-700/60 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-rose-400" />
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                      SVI Trend Timeline Across Contacts
                    </h4>
                  </div>
                  {caseItem.sviHistory.length > 1 && (
                    <span className="text-xs text-amber-400 font-medium">
                      Trend Escalation: +{caseItem.currentSVI.sviScore - caseItem.sviHistory[0].score} pts since initial contact
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {caseItem.sviHistory.map((step, idx) => (
                    <div key={idx} className="bg-slate-900/60 border border-slate-800 p-3 rounded-lg relative">
                      <div className="text-[11px] text-slate-400 flex items-center justify-between">
                        <span>{step.date}</span>
                        <span className="text-slate-500 font-mono text-[10px]">{step.contactType}</span>
                      </div>
                      <div className="flex items-baseline gap-2 mt-1.5">
                        <span className="text-xl font-bold font-mono text-white">{step.score}</span>
                        <span className={`text-xs font-semibold ${
                          step.category === 'Critical' ? 'text-rose-400' :
                          step.category === 'High' ? 'text-amber-400' :
                          step.category === 'Moderate' ? 'text-blue-400' : 'text-emerald-400'
                        }`}>
                          {step.category}
                        </span>
                      </div>
                      {idx < caseItem.sviHistory.length - 1 && (
                        <div className="hidden sm:block absolute -right-2.5 top-1/2 -translate-y-1/2 text-slate-600 z-10">
                          →
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Four Sub-Scores Breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-800/50 border border-slate-700/60 p-3.5 rounded-lg">
                  <div className="text-[11px] text-slate-400">Emotional Distress (ED)</div>
                  <div className="text-2xl font-bold font-mono text-white mt-1">{svi.subScores.ED}</div>
                  <div className="w-full bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-rose-500 h-full rounded-full" style={{ width: `${svi.subScores.ED}%` }} />
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">Weight 0.30 · ASR/Prosody</div>
                </div>

                <div className="bg-slate-800/50 border border-slate-700/60 p-3.5 rounded-lg">
                  <div className="text-[11px] text-slate-400">Self-Harm Risk (SH)</div>
                  <div className="text-2xl font-bold font-mono text-white mt-1">{svi.subScores.SH}</div>
                  <div className="w-full bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: `${svi.subScores.SH}%` }} />
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">Weight 0.30 · C-SSRS Item</div>
                </div>

                <div className="bg-slate-800/50 border border-slate-700/60 p-3.5 rounded-lg">
                  <div className="text-[11px] text-slate-400">External Threat (TH)</div>
                  <div className="text-2xl font-bold font-mono text-white mt-1">{svi.subScores.TH}</div>
                  <div className="w-full bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-orange-500 h-full rounded-full" style={{ width: `${svi.subScores.TH}%` }} />
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">Weight 0.25 · Retaliation/PoA</div>
                </div>

                <div className="bg-slate-800/50 border border-slate-700/60 p-3.5 rounded-lg">
                  <div className="text-[11px] text-slate-400">Support Deficit (SI)</div>
                  <div className="text-2xl font-bold font-mono text-white mt-1">{svi.subScores.SI}</div>
                  <div className="w-full bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-purple-500 h-full rounded-full" style={{ width: `${svi.subScores.SI}%` }} />
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">Weight 0.15 · Boycott/Water</div>
                </div>
              </div>

              {/* Hard Overrides & Attributed Evidence */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Explainable Decision Rationale &amp; Overrides
                </h4>
                <div className="bg-slate-800/30 border border-slate-700/60 rounded-lg p-4 space-y-2.5">
                  {svi.explanationBullets.map((bullet, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                      <span className="text-rose-400 mt-0.5">•</span>
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Transcript Extract */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Caller Narrative Transcript
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    Consent: {caseItem.consent.analysisConsent ? 'Verified Assistive Opt-In' : 'No Consent'}
                  </span>
                </div>
                <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 text-xs font-sans leading-relaxed text-slate-200">
                  {caseItem.transcript}
                </div>
              </div>
            </>
          )}

          {/* Suggested Pathways */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Suggested Support Pathways (Risk-to-Action Matrix)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {svi.suggestedPathways.map((pathway, idx) => (
                <div key={idx} className="bg-slate-800/50 border border-slate-700/50 p-2.5 rounded text-xs text-slate-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                  <span>{pathway}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Prior Review Record if exists */}
          {caseItem.reviewDetails && (
            <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-3.5 text-xs space-y-1">
              <div className="flex items-center justify-between text-slate-300 font-semibold">
                <span>Prior Review: {caseItem.reviewStatus.toUpperCase()}</span>
                <span className="text-slate-400 font-mono text-[11px]">{caseItem.reviewDetails.reviewTimestamp}</span>
              </div>
              <p className="text-slate-400">By: {caseItem.reviewDetails.reviewedBy}</p>
              <p className="text-slate-200 italic mt-1">&ldquo;{caseItem.reviewDetails.decisionReason}&rdquo;</p>
            </div>
          )}

          {/* Decision Workflow (Accept / Modify / Reject) with mandatory audit reason */}
          <div className="border-t border-slate-800 pt-5 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
                Counsellor Review Decision (§11 Mandatory Human Audit)
              </h4>
              {onOpenWarmHandoff && svi.finalCategory === 'Critical' && (
                <button
                  type="button"
                  onClick={onOpenWarmHandoff}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  Initiate Warm Handoff →
                </button>
              )}
            </div>

            {submittedMessage ? (
              <div className="bg-emerald-950/30 border border-emerald-700/50 p-3 rounded-lg text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{submittedMessage}</span>
              </div>
            ) : (
              <form onSubmit={handleDecisionSubmit} className="space-y-3">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setActionType('accept')}
                    className={`flex-1 py-2 px-3 text-xs font-semibold rounded border transition-colors ${
                      actionType === 'accept'
                        ? 'bg-emerald-600 text-white border-emerald-500'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                    }`}
                  >
                    Accept AI Category ({svi.finalCategory})
                  </button>

                  <button
                    type="button"
                    onClick={() => setActionType('modify')}
                    className={`flex-1 py-2 px-3 text-xs font-semibold rounded border transition-colors ${
                      actionType === 'modify'
                        ? 'bg-amber-600 text-white border-amber-500'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                    }`}
                  >
                    Modify Category
                  </button>

                  <button
                    type="button"
                    onClick={() => setActionType('reject')}
                    className={`flex-1 py-2 px-3 text-xs font-semibold rounded border transition-colors ${
                      actionType === 'reject'
                        ? 'bg-rose-600 text-white border-rose-500'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                    }`}
                  >
                    Reject Assessment
                  </button>
                </div>

                {actionType === 'modify' && (
                  <div className="bg-slate-800/40 p-3 rounded border border-slate-700 space-y-2">
                    <label className="text-xs text-slate-300 font-medium block">
                      Select Human Assigned Category:
                    </label>
                    <div className="flex gap-2">
                      {(['Low', 'Moderate', 'High', 'Critical'] as RiskLevel[]).map(cat => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setModifiedCategory(cat)}
                          className={`px-3 py-1 text-xs rounded border ${
                            modifiedCategory === cat
                              ? 'bg-rose-600 text-white border-rose-500'
                              : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {actionType && (
                  <div className="space-y-2">
                    <label className="text-xs text-slate-300 font-medium block">
                      Mandatory Clinical Audit Justification ({actionType.toUpperCase()}):
                    </label>
                    <textarea
                      value={decisionReason}
                      onChange={(e) => setDecisionReason(e.target.value)}
                      placeholder="Specify clinical observations, verification with caller, or safety protocol notes..."
                      className="w-full h-20 bg-slate-950 border border-slate-700 rounded p-2.5 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
                      required
                    />
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={!decisionReason.trim()}
                        className="py-1.5 px-4 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white rounded text-xs font-semibold transition-colors flex items-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Commit Audit Log &amp; Dispatch Referral</span>
                      </button>
                    </div>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Geo-Fenced Resource Locator Modal */}
      <ResourceLocatorModal
        isOpen={isResourceLocatorOpen}
        onClose={() => setIsResourceLocatorOpen(false)}
        caseLocation={{
          district: caseItem.district,
          state: caseItem.state,
          callerAlias: caseItem.callerAlias,
          caseId: caseItem.id,
        }}
      />
    </div>
  );
};

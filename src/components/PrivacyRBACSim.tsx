import React, { useState } from 'react';
import { UserRole } from '../types';
import {
  ShieldAlert,
  Lock,
  Eye,
  EyeOff,
  FileCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Building,
  Users,
  ShieldCheck
} from 'lucide-react';

interface PrivacyRBACSimProps {
  activeRole: UserRole;
  setActiveRole: (r: UserRole) => void;
}

export const PrivacyRBACSim: React.FC<PrivacyRBACSimProps> = ({ activeRole, setActiveRole }) => {
  const [restrictedRoutingActive, setRestrictedRoutingActive] = useState<boolean>(true);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Privacy, Legal Safeguards &amp; Tiered Access Control Simulator (§9)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Demonstrates the statutory legal-rights firewall, DPDP Act 2023 compliance, and retaliation-aware restricted routing.
            </p>
          </div>
        </div>
      </div>

      {/* Role Switcher for Simulator */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
          Simulate Role-Based Access Control (RBAC) Lens
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => setActiveRole('psychosocial_counsellor')}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
              activeRole === 'psychosocial_counsellor'
                ? 'bg-rose-950/40 border-rose-500 text-white shadow-sm'
                : 'bg-slate-800/40 border-slate-800 hover:border-slate-700 text-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-400">1. Central NHAA Cell</span>
              {activeRole === 'psychosocial_counsellor' && <CheckCircle2 className="w-4 h-4 text-rose-400" />}
            </div>
            <div className="text-sm font-semibold text-white mt-1">Senior Psychosocial Counsellor</div>
            <p className="text-[11px] text-slate-400 mt-1">
              Full clinical visibility: SVI score, 4 sub-scores, acoustic telemetry, full transcript, and suicide risk indicators.
            </p>
          </button>

          <button
            onClick={() => setActiveRole('district_nodal_officer')}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
              activeRole === 'district_nodal_officer'
                ? 'bg-rose-950/40 border-rose-500 text-white shadow-sm'
                : 'bg-slate-800/40 border-slate-800 hover:border-slate-700 text-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400">2. District Nodal Officer</span>
              {activeRole === 'district_nodal_officer' && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
            </div>
            <div className="text-sm font-semibold text-white mt-1">PoA Special Cell / DM Desk</div>
            <p className="text-[11px] text-slate-400 mt-1">
              Action-level need only: &ldquo;Witness protection assessment requested, Urgency: High&rdquo;. No raw clinical notes.
            </p>
          </button>

          <button
            onClick={() => setActiveRole('police_officer')}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
              activeRole === 'police_officer'
                ? 'bg-rose-950/40 border-rose-500 text-white shadow-sm'
                : 'bg-slate-800/40 border-slate-800 hover:border-slate-700 text-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-sky-400">3. Law Enforcement / Police</span>
              {activeRole === 'police_officer' && <CheckCircle2 className="w-4 h-4 text-sky-400" />}
            </div>
            <div className="text-sm font-semibold text-white mt-1">Investigating Officer (DSP/ACP)</div>
            <p className="text-[11px] text-slate-400 mt-1">
              Strictly firewalled: Only approved security protection request with logistics. NO narrative, NO SVI, NO clinical record.
            </p>
          </button>
        </div>
      </div>

      {/* Tiered Data Field Visibility Matrix */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
          Field-Level Redaction &amp; Visibility Audit (Active Role: {activeRole.replace('_', ' ').toUpperCase()})
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-4">Information Asset</th>
                <th className="py-2.5 px-4">Central NHAA Counsellor</th>
                <th className="py-2.5 px-4">District Nodal Officer</th>
                <th className="py-2.5 px-4">Police / Investigation</th>
                <th className="py-2.5 px-4">Your Active Role View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              <tr>
                <td className="py-3 px-4 font-semibold text-white">Numerical SVI Score (0-100)</td>
                <td className="py-3 px-4 text-emerald-400 font-mono">VISIBLE (Full)</td>
                <td className="py-3 px-4 text-amber-400">Categorical Band Only</td>
                <td className="py-3 px-4 text-rose-400 flex items-center gap-1 font-mono">
                  <EyeOff className="w-3 h-3" /> REDACTED
                </td>
                <td className="py-3 px-4 font-mono font-bold">
                  {activeRole === 'police_officer' ? (
                    <span className="text-rose-400">[REDACTED: FIREWALLED]</span>
                  ) : activeRole === 'district_nodal_officer' ? (
                    <span className="text-amber-400">BAND: CRITICAL</span>
                  ) : (
                    <span className="text-emerald-400">SVI: 86 / 100</span>
                  )}
                </td>
              </tr>

              <tr>
                <td className="py-3 px-4 font-semibold text-white">4 Sub-Scores (ED, SH, TH, SI)</td>
                <td className="py-3 px-4 text-emerald-400 font-mono">VISIBLE</td>
                <td className="py-3 px-4 text-rose-400 flex items-center gap-1 font-mono"><EyeOff className="w-3 h-3" /> REDACTED</td>
                <td className="py-3 px-4 text-rose-400 flex items-center gap-1 font-mono"><EyeOff className="w-3 h-3" /> REDACTED</td>
                <td className="py-3 px-4 font-mono font-bold">
                  {activeRole === 'psychosocial_counsellor' ? (
                    <span className="text-emerald-400">ED:78 SH:41 TH:92 SI:66</span>
                  ) : (
                    <span className="text-rose-400">[REDACTED]</span>
                  )}
                </td>
              </tr>

              <tr>
                <td className="py-3 px-4 font-semibold text-white">Trauma Narrative &amp; Audio Replay</td>
                <td className="py-3 px-4 text-emerald-400 font-mono">VISIBLE (Consented)</td>
                <td className="py-3 px-4 text-rose-400 flex items-center gap-1 font-mono"><EyeOff className="w-3 h-3" /> REDACTED</td>
                <td className="py-3 px-4 text-rose-400 flex items-center gap-1 font-mono"><EyeOff className="w-3 h-3" /> REDACTED</td>
                <td className="py-3 px-4 font-mono font-bold">
                  {activeRole === 'psychosocial_counsellor' ? (
                    <span className="text-emerald-400">Full Audio &amp; Transcript</span>
                  ) : (
                    <span className="text-rose-400">[REDACTED: PRIVATE STORE]</span>
                  )}
                </td>
              </tr>

              <tr>
                <td className="py-3 px-4 font-semibold text-white">Actionable Protection Request</td>
                <td className="py-3 px-4 text-emerald-400 font-mono">CAN INITIATE</td>
                <td className="py-3 px-4 text-emerald-400 font-mono">APPROVES / ROUTES</td>
                <td className="py-3 px-4 text-emerald-400 font-mono">RECEIVES LOGISTICS</td>
                <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                  ACTION: PATROL VERIFY
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Retaliation-Aware Restricted Routing */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Retaliation-Aware Restricted Routing (§9.3)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Protects callers when perpetrators are locally powerful (e.g. Sarpanch, MLA, local police influence).
            </p>
          </div>

          <button
            onClick={() => setRestrictedRoutingActive(!restrictedRoutingActive)}
            className={`py-1.5 px-3 rounded text-xs font-semibold border transition-colors cursor-pointer ${
              restrictedRoutingActive
                ? 'bg-purple-600 text-white border-purple-500'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            {restrictedRoutingActive ? 'Restricted Routing: ENABLED' : 'Restricted Routing: STANDARD'}
          </button>
        </div>

        <div className={`p-4 rounded-lg border text-xs leading-relaxed ${
          restrictedRoutingActive
            ? 'bg-purple-950/20 border-purple-700/50 text-purple-200'
            : 'bg-slate-950 border-slate-800 text-slate-400'
        }`}>
          {restrictedRoutingActive ? (
            <div className="space-y-2">
              <div className="font-semibold text-purple-300 flex items-center gap-2 text-sm">
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                <span>Restricted State/Central Escalation Active</span>
              </div>
              <p>
                Local police station and village panchayat level access are completely bypassed. All referral requests, DLSA assignments, and protection orders are routed directly to the <strong>State Nodal Officer (ADGP Human Rights / PoA Cell)</strong> and designated Special Court public prosecutor.
              </p>
              <div className="text-[11px] font-mono text-purple-300 bg-purple-900/30 p-2 rounded">
                Audit Status: Immutable SHA-256 Ledger Node Verified · No local leak risk.
              </div>
            </div>
          ) : (
            <p>
              Standard routing active: Notification sent to District Social Welfare Officer and local Sub-Divisional Police Officer.
            </p>
          )}
        </div>
      </div>

      {/* Legal-Rights Firewall Guarantee Callout */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
          <AlertTriangle className="w-4 h-4" />
          <span>Statutory Legal-Rights Firewall Guarantee (§9)</span>
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          The SVI and psychosocial records live in a physically and logically isolated psychosocial data store. <strong>SVI never influences the registration of an FIR, relief entitlement, compensation under PoA Rule 12, or case priority in the court.</strong> It solely accelerates clinical, protective, and humanitarian support for the victim.
        </p>
      </div>
    </div>
  );
};

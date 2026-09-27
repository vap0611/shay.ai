import React from 'react';
import { UserRole } from '../types';
import { ShieldCheck, PhoneCall, AlertTriangle, Lock, HelpCircle, MapPin } from 'lucide-react';

interface TopNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  criticalAlertCount: number;
  onOpenHowItWorks?: () => void;
  onOpenResources?: () => void;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({
  activeTab,
  setActiveTab,
  activeRole,
  setActiveRole,
  criticalAlertCount,
  onOpenHowItWorks,
  onOpenResources,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element Brand Title */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
            S2
          </div>
          <button
            onClick={() => setActiveTab('assist')}
            className="text-left group cursor-pointer"
          >
            <span className="text-base font-bold tracking-tight text-white group-hover:text-rose-400 transition-colors">
              SAHAY-AI v2
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs text-slate-400 font-normal">
              NHAA 14566 Psychosocial Vulnerability Layer
            </span>
          </button>
        </div>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-300">
          <button
            onClick={() => setActiveTab('assist')}
            className={`transition-colors relative py-1 cursor-pointer ${
              activeTab === 'assist' ? 'text-rose-400 font-semibold border-b-2 border-rose-500' : 'hover:text-white'
            }`}
          >
            Live Helpline Assist
          </button>

          <button
            onClick={() => setActiveTab('queue')}
            className={`transition-colors relative py-1 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'queue' ? 'text-rose-400 font-semibold border-b-2 border-rose-500' : 'hover:text-white'
            }`}
          >
            <span>Counsellor Queue</span>
            {criticalAlertCount > 0 && (
              <span className="text-[10px] bg-rose-500/20 text-rose-300 px-1.5 py-0.2 rounded font-mono tabular-nums">
                {criticalAlertCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('consent')}
            className={`transition-colors relative py-1 cursor-pointer ${
              activeTab === 'consent' ? 'text-rose-400 font-semibold border-b-2 border-rose-500' : 'hover:text-white'
            }`}
          >
            Consent Gateway
          </button>

          <button
            onClick={() => setActiveTab('screening')}
            className={`transition-colors relative py-1 cursor-pointer ${
              activeTab === 'screening' ? 'text-rose-400 font-semibold border-b-2 border-rose-500' : 'hover:text-white'
            }`}
          >
            Micro-Screening
          </button>

          <button
            onClick={() => setActiveTab('rbac')}
            className={`transition-colors relative py-1 cursor-pointer ${
              activeTab === 'rbac' ? 'text-rose-400 font-semibold border-b-2 border-rose-500' : 'hover:text-white'
            }`}
          >
            Privacy &amp; RBAC
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`transition-colors relative py-1 cursor-pointer ${
              activeTab === 'audit' ? 'text-rose-400 font-semibold border-b-2 border-rose-500' : 'hover:text-white'
            }`}
          >
            Validation &amp; Audit
          </button>
        </nav>

        {/* Zone 3: 1-2 Primary actions & Role Switcher */}
        <div className="flex items-center gap-2">
          {onOpenResources && (
            <button
              onClick={onOpenResources}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 transition-all cursor-pointer shadow-sm"
              title="Open Geo-Fenced Resource Locator & Legal Directory"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Resource Locator</span>
            </button>
          )}

          {onOpenHowItWorks && (
            <button
              onClick={onOpenHowItWorks}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 transition-all cursor-pointer shadow-sm"
              title="Open System Architecture & Operational Guide"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">How It Works</span>
            </button>
          )}

          <div className="flex items-center gap-1.5 bg-slate-800/80 border border-slate-700/60 rounded-lg px-2.5 py-1 text-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <label htmlFor="role-select" className="text-slate-400 sr-only">Active View Role</label>
            <select
              id="role-select"
              value={activeRole}
              onChange={(e) => setActiveRole(e.target.value as UserRole)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer text-xs font-medium"
            >
              <option value="psychosocial_counsellor" className="bg-slate-800 text-slate-100">
                Psychosocial Counsellor (Full)
              </option>
              <option value="district_nodal_officer" className="bg-slate-800 text-slate-100">
                District Nodal Officer (Need-to-Know)
              </option>
              <option value="police_officer" className="bg-slate-800 text-slate-100">
                Police / Protection (Firewalled)
              </option>
              <option value="system_auditor" className="bg-slate-800 text-slate-100">
                Ethics &amp; Bias Auditor
              </option>
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};

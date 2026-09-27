import React, { useState } from 'react';
import { HelplineCase, RiskLevel, UserRole } from '../types';
import {
  Clock,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Filter,
  Search,
  Shield,
  PhoneCall,
  Eye,
  SlidersHorizontal,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { CaseDetailModal } from './CaseDetailModal';

interface CounsellorQueueProps {
  cases: HelplineCase[];
  activeRole: UserRole;
  onUpdateCase: (updated: HelplineCase) => void;
  onOpenWarmHandoff?: (c: HelplineCase) => void;
}

export const CounsellorQueue: React.FC<CounsellorQueueProps> = ({
  cases,
  activeRole,
  onUpdateCase,
  onOpenWarmHandoff,
}) => {
  const [selectedCase, setSelectedCase] = useState<HelplineCase | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterLanguage, setFilterLanguage] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filtering
  const filteredCases = cases.filter((c) => {
    if (filterCategory !== 'all' && c.currentSVI.finalCategory !== filterCategory) return false;
    if (filterLanguage !== 'all' && c.language !== filterLanguage) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        c.callerAlias.toLowerCase().includes(q) ||
        c.district.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        c.transcript.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Sorting: Critical first, then High, Moderate, Low; then by SLA remaining
  const categoryRank: Record<RiskLevel, number> = {
    Critical: 4,
    High: 3,
    Moderate: 2,
    Low: 1,
  };

  const sortedCases = [...filteredCases].sort((a, b) => {
    const rankDiff = categoryRank[b.currentSVI.finalCategory] - categoryRank[a.currentSVI.finalCategory];
    if (rankDiff !== 0) return rankDiff;
    return a.slaMinutesRemaining - b.slaMinutesRemaining;
  });

  const formatSla = (mins: number) => {
    if (mins < 60) return `${mins}m`;
    const hours = Math.floor(mins / 60);
    const remMins = mins % 60;
    return remMins > 0 ? `${hours}h ${remMins}m` : `${hours}h`;
  };

  return (
    <div className="space-y-5">
      {/* Header with Title and Search/Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <span>Psychosocial Triage &amp; Counsellor Queue</span>
              <span className="text-xs bg-slate-800 text-slate-300 font-mono px-2 py-0.5 rounded">
                {cases.length} active cases
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Strictly prioritized by Stress Vulnerability Index (SVI) and statutory escalation SLA timers.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Escalation SLA:</span>
            <span className="text-rose-400 font-semibold font-mono">Critical ≤ 15m</span>
            <span className="text-slate-600">·</span>
            <span className="text-amber-400 font-semibold font-mono">High ≤ 4h</span>
            <span className="text-slate-600">·</span>
            <span className="text-blue-400 font-semibold font-mono">Mod ≤ 48h</span>
          </div>
        </div>

        {/* Filter Controls (Segmented Tabs adhering to Frontend Constitution) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-800">
          <div className="flex items-center gap-1.5 p-1 bg-slate-800/80 rounded-lg w-full sm:w-auto overflow-x-auto">
            {['all', 'Critical', 'High', 'Moderate', 'Low'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                  filterCategory === cat
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                {cat === 'all' ? 'All Tiers' : cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-60">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search alias, district, or term..."
                className="w-full bg-slate-950 border border-slate-700/70 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
              />
            </div>

            <select
              value={filterLanguage}
              onChange={(e) => setFilterLanguage(e.target.value)}
              className="bg-slate-950 border border-slate-700/70 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
            >
              <option value="all">All Languages</option>
              <option value="hi">Hindi (hi)</option>
              <option value="gu">Gujarati (gu)</option>
              <option value="en">English (en)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Case Table / High Density Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Case ID / Caller</th>
                <th className="py-3 px-4">Location &amp; Channel</th>
                <th className="py-3 px-4 text-center">SVI Score</th>
                <th className="py-3 px-4">Sub-Scores (ED/SH/TH/SI)</th>
                <th className="py-3 px-4">Trend &amp; Overrides</th>
                <th className="py-3 px-4">SLA Remaining</th>
                <th className="py-3 px-4 text-center">Audit Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {sortedCases.map((caseItem) => {
                const svi = caseItem.currentSVI;
                const isCritical = svi.finalCategory === 'Critical';
                const hasTrendJump = caseItem.sviHistory.length > 1 && (svi.sviScore - caseItem.sviHistory[0].score >= 15);

                return (
                  <tr
                    key={caseItem.id}
                    className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                    onClick={() => setSelectedCase(caseItem)}
                  >
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white group-hover:text-rose-400 transition-colors">
                        {caseItem.callerAlias}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5 flex items-center gap-1.5">
                        <span>{caseItem.id}</span>
                        {caseItem.restrictedRouting && (
                          <span className="text-purple-400 font-bold" title="Restricted Routing">
                            [STATE NODAL]
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="text-slate-300">{caseItem.district}, {caseItem.state}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {caseItem.channel.replace('_', ' ')} · Lang: {caseItem.language.toUpperCase()}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex flex-col items-center">
                        <span className={`font-mono text-sm font-bold ${
                          isCritical ? 'text-rose-400' :
                          svi.finalCategory === 'High' ? 'text-amber-400' :
                          svi.finalCategory === 'Moderate' ? 'text-blue-400' : 'text-emerald-400'
                        }`}>
                          {activeRole === 'police_officer' ? 'REDACTED' : svi.sviScore}
                        </span>
                        <span className={`text-[9px] font-bold uppercase tracking-wider ${
                          isCritical ? 'text-rose-400' :
                          svi.finalCategory === 'High' ? 'text-amber-400' :
                          svi.finalCategory === 'Moderate' ? 'text-blue-400' : 'text-emerald-400'
                        }`}>
                          {svi.finalCategory}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      {activeRole === 'police_officer' ? (
                        <span className="text-slate-500 italic text-[11px]">Firewalled (Psychosocial Store)</span>
                      ) : (
                        <div className="flex items-center gap-2 font-mono text-[11px]">
                          <span className="text-rose-400" title="Emotional Distress">ED:{svi.subScores.ED}</span>
                          <span className="text-amber-400" title="Self-Harm">SH:{svi.subScores.SH}</span>
                          <span className="text-orange-400" title="Threat">TH:{svi.subScores.TH}</span>
                          <span className="text-purple-400" title="Isolation">SI:{svi.subScores.SI}</span>
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-1">
                        {svi.isOverridden && (
                          <span className="text-[10px] bg-rose-950 text-rose-300 px-1.5 py-0.5 rounded border border-rose-800/60 w-fit">
                            Rule: {svi.overrides[0]?.ruleName.split(':')[0]}
                          </span>
                        )}
                        {hasTrendJump && (
                          <span className="text-[10px] text-amber-400 flex items-center gap-1 font-medium">
                            <TrendingUp className="w-3 h-3" />
                            <span>+{svi.sviScore - caseItem.sviHistory[0].score} pts escalation</span>
                          </span>
                        )}
                        {!svi.isOverridden && !hasTrendJump && (
                          <span className="text-[10px] text-slate-500">Calibrated Fusion</span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 font-mono text-[11px]">
                        <Clock className={`w-3.5 h-3.5 ${
                          caseItem.slaMinutesRemaining <= 15 ? 'text-rose-400 animate-pulse' : 'text-slate-400'
                        }`} />
                        <span className={`${
                          caseItem.slaMinutesRemaining <= 15 ? 'text-rose-400 font-bold' : 'text-slate-300'
                        }`}>
                          {formatSla(caseItem.slaMinutesRemaining)}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider ${
                        caseItem.reviewStatus === 'accepted' ? 'bg-emerald-500/20 text-emerald-300' :
                        caseItem.reviewStatus === 'modified' ? 'bg-amber-500/20 text-amber-300' :
                        caseItem.reviewStatus === 'rejected' ? 'bg-rose-500/20 text-rose-300' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        {caseItem.reviewStatus}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCase(caseItem);
                        }}
                        className="py-1 px-2.5 bg-slate-800 hover:bg-rose-600 text-slate-200 hover:text-white rounded text-xs font-medium transition-colors"
                      >
                        Inspect &amp; Triage
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Case Detail & Audit Modal */}
      {selectedCase && (
        <CaseDetailModal
          caseItem={selectedCase}
          isOpen={!!selectedCase}
          onClose={() => setSelectedCase(null)}
          activeRole={activeRole}
          onUpdateCase={(updated) => {
            onUpdateCase(updated);
            setSelectedCase(updated);
          }}
          onOpenWarmHandoff={() => {
            if (onOpenWarmHandoff) onOpenWarmHandoff(selectedCase);
          }}
        />
      )}
    </div>
  );
};

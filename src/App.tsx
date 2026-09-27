import React, { useState } from 'react';
import { HelplineCase, MicroScreeningAnswers, UserRole } from './types';
import { INITIAL_COUNSELLOR_QUEUE } from './data/scenarios';
import { TopNavigation } from './components/TopNavigation';
import { LiveHelplineAssist } from './components/LiveHelplineAssist';
import { CounsellorQueue } from './components/CounsellorQueue';
import { ConsentGateway } from './components/ConsentGateway';
import { MicroScreeningModal } from './components/MicroScreeningModal';
import { PrivacyRBACSim } from './components/PrivacyRBACSim';
import { ValidationAuditView } from './components/ValidationAuditView';
import { HowItWorksModal } from './components/HowItWorksModal';
import { ResourceLocatorModal } from './components/ResourceLocatorModal';
import { ShieldAlert, PhoneCall, HeartHandshake, Info } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('assist');
  const [activeRole, setActiveRole] = useState<UserRole>('psychosocial_counsellor');
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState<boolean>(false);
  const [isResourcesOpen, setIsResourcesOpen] = useState<boolean>(false);
  const [cases, setCases] = useState<HelplineCase[]>(INITIAL_COUNSELLOR_QUEUE);
  const [screeningData, setScreeningData] = useState<Partial<MicroScreeningAnswers>>({
    phq2_depressedMood: 1,
    phq2_anhedonia: 1,
    gad2_anxiety: 2,
    gad2_uncontrollableWorry: 1,
    pcptsd_nightmaresOrHyperarousal: true,
    cssrs_suicidalThoughts: false,
    cssrs_suicidalPlan: false,
  });

  const handleUpdateCase = (updated: HelplineCase) => {
    setCases((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  };

  const handleAddOrUpdateCase = (newCase: HelplineCase) => {
    setCases((prev) => {
      const idx = prev.findIndex((c) => c.id === newCase.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = newCase;
        return next;
      }
      return [newCase, ...prev];
    });
  };

  const criticalCount = cases.filter(
    (c) => c.currentSVI.finalCategory === 'Critical' && c.reviewStatus === 'pending'
  ).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      {/* Top Bar Header adhering strictly to Top Bar Contract */}
      <TopNavigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeRole={activeRole}
        setActiveRole={setActiveRole}
        criticalAlertCount={criticalCount}
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
        onOpenResources={() => setIsResourcesOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'assist' && (
          <LiveHelplineAssist
            onCaseCreatedOrUpdated={handleAddOrUpdateCase}
            onOpenScreening={() => setActiveTab('screening')}
            onOpenConsent={() => setActiveTab('consent')}
            screeningData={screeningData}
          />
        )}

        {activeTab === 'queue' && (
          <CounsellorQueue
            cases={cases}
            activeRole={activeRole}
            onUpdateCase={handleUpdateCase}
          />
        )}

        {activeTab === 'consent' && (
          <ConsentGateway
            onConsentChange={(c) => {
              // Updates reflected
            }}
          />
        )}

        {activeTab === 'screening' && (
          <MicroScreeningModal
            initialData={screeningData}
            onSave={(data) => {
              setScreeningData(data);
              setActiveTab('assist');
            }}
            onClose={() => setActiveTab('assist')}
          />
        )}

        {activeTab === 'rbac' && (
          <PrivacyRBACSim
            activeRole={activeRole}
            setActiveRole={setActiveRole}
          />
        )}

        {activeTab === 'audit' && (
          <ValidationAuditView />
        )}
      </main>

      {/* Interactive System Architecture & Operational Guide Modal */}
      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          setIsHowItWorksOpen(false);
        }}
      />

      {/* Global / On-Demand Geo-Fenced Resource Locator Modal */}
      <ResourceLocatorModal
        isOpen={isResourcesOpen}
        onClose={() => setIsResourcesOpen(false)}
        caseLocation={{
          district: 'Morbi',
          state: 'Gujarat',
          callerAlias: 'District Legal Aid & Crisis Directory',
        }}
      />

      {/* Institutional Legal Decoupling & Statutory Disclaimer Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/90 text-slate-500 text-xs py-5 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="space-y-0.5">
            <p className="text-slate-400 font-medium">
              SAHAY-AI v2 · Smart Assistance &amp; Human-Centric Assessment for Atrocity Victims
            </p>
            <p className="text-[11px] text-slate-500">
              A clinical decision-support layer for NHAA (14566). Does not diagnose. Never gates or modifies legal rights under the SC/ST (PoA) Act 1989.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
            <span>NHAA Helpline: <strong className="text-slate-200">14566</strong></span>
            <span>·</span>
            <span>Tele-MANAS: <strong className="text-slate-200">14416</strong></span>
            <span>·</span>
            <span>Police: <strong className="text-slate-200">112</strong></span>
          </div>
        </div>
      </footer>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CaseManagerBar } from './components/CaseManagerBar';
import { BusinessEssentialsView } from './components/BusinessEssentialsView';
import { BusinessHealthView } from './components/BusinessHealthView';
import { RecommendationView } from './components/RecommendationView';
import { ExecutiveMemo } from './components/ExecutiveMemo';
import { CashFlowWorkbench } from './components/CashFlowWorkbench';
import { ClientMatrixCalculator } from './components/ClientMatrixCalculator';
import { OptionsEvaluationMatrix } from './components/OptionsEvaluationMatrix';
import { Roadmap90Day } from './components/Roadmap90Day';
import { WeeklyDashboardView } from './components/WeeklyDashboardView';
import { SevenDaySprint } from './components/SevenDaySprint';
import { AICoachConsole } from './components/AICoachConsole';
import { ReportExportModal } from './components/ReportExportModal';

import { 
  CaseRecord, 
  BusinessProfile, 
  HealthDimensionKey, 
  HealthDimensionInput, 
  RecommendationOutput,
  FinancialData 
} from './types/bizpulse';
import { 
  loadAllCases, 
  loadActiveCase, 
  saveCase, 
  setActiveCaseId, 
  deleteCase, 
  createBlankCase, 
  calculateOverallHealth 
} from './services/caseStorage';
import { DEMO_MSP_CASE, DEMO_CASE_ID } from './data/demonstrationCase';

export default function App() {
  const [cases, setCases] = useState<CaseRecord[]>(() => loadAllCases());
  const [activeCase, setActiveCase] = useState<CaseRecord>(() => loadActiveCase());
  const [activeTab, setActiveTab] = useState<string>('memo');
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [coachInitialPrompt, setCoachInitialPrompt] = useState<string | undefined>(undefined);

  // Sync state if activeCase updates
  const refreshCaseState = () => {
    const all = loadAllCases();
    setCases(all);
    const current = loadActiveCase();
    setActiveCase(current);
  };

  const handleSwitchCase = (caseId: string) => {
    setActiveCaseId(caseId);
    const found = cases.find(c => c.id === caseId);
    if (found) {
      setActiveCase(found);
      // If switching to an incomplete new case, open Essentials tab
      if (!found.profile.isDemonstrationCase && !found.recommendations) {
        setActiveTab('essentials');
      } else {
        setActiveTab('memo');
      }
    }
  };

  const handleNewCase = () => {
    const blank = createBlankCase();
    const updatedCases = loadAllCases();
    setCases(updatedCases);
    setActiveCase(blank);
    setActiveTab('essentials');
  };

  const handleLoadDemoCase = () => {
    saveCase(DEMO_MSP_CASE);
    setActiveCaseId(DEMO_CASE_ID);
    const updatedCases = loadAllCases();
    setCases(updatedCases);
    setActiveCase(DEMO_MSP_CASE);
    setActiveTab('memo');
  };

  const handleDeleteCase = (caseId: string) => {
    const next = deleteCase(caseId);
    const updatedCases = loadAllCases();
    setCases(updatedCases);
    setActiveCase(next);
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(activeCase, null, 2));
    const downloadAnchor = document.createElement('a');
    const filename = `${activeCase.profile.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_case.json`;
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', filename);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJson = (jsonString: string) => {
    try {
      const parsed: CaseRecord = JSON.parse(jsonString);
      if (!parsed.profile || !parsed.healthInputs) {
        throw new Error('Missing profile or health inputs in case JSON');
      }
      // Ensure unique case ID if colliding with demo
      if (parsed.id === DEMO_CASE_ID && !parsed.profile.isDemonstrationCase) {
        parsed.id = 'imported-' + Date.now();
        parsed.profile.caseId = parsed.id;
      }
      saveCase(parsed);
      setActiveCaseId(parsed.id);
      refreshCaseState();
      setActiveTab('memo');
    } catch (err: any) {
      console.error('Failed to import JSON case:', err);
      alert('Failed to import case file: ' + err.message);
    }
  };

  const handleUpdateProfile = (updatedProfile: BusinessProfile) => {
    const updatedCase: CaseRecord = {
      ...activeCase,
      profile: updatedProfile,
      updatedAt: new Date().toISOString(),
    };
    saveCase(updatedCase);
    setActiveCase(updatedCase);
    setCases(prev => prev.map(c => c.id === updatedCase.id ? updatedCase : c));
  };

  const handleUpdateHealthInput = (key: HealthDimensionKey, updatedInput: HealthDimensionInput) => {
    const newHealthInputs = {
      ...activeCase.healthInputs,
      [key]: updatedInput,
    };
    const newOverallHealth = calculateOverallHealth(newHealthInputs, activeCase.financials);
    const updatedCase: CaseRecord = {
      ...activeCase,
      healthInputs: newHealthInputs,
      overallHealth: newOverallHealth,
      updatedAt: new Date().toISOString(),
    };
    saveCase(updatedCase);
    setActiveCase(updatedCase);
    setCases(prev => prev.map(c => c.id === updatedCase.id ? updatedCase : c));
  };

  const handleRecalculateOverall = () => {
    const newOverallHealth = calculateOverallHealth(activeCase.healthInputs, activeCase.financials);
    const updatedCase: CaseRecord = {
      ...activeCase,
      overallHealth: newOverallHealth,
      updatedAt: new Date().toISOString(),
    };
    saveCase(updatedCase);
    setActiveCase(updatedCase);
    setCases(prev => prev.map(c => c.id === updatedCase.id ? updatedCase : c));
  };

  const handleUpdateRecommendations = (rec: RecommendationOutput) => {
    const updatedCase: CaseRecord = {
      ...activeCase,
      recommendations: rec,
      updatedAt: new Date().toISOString(),
    };
    saveCase(updatedCase);
    setActiveCase(updatedCase);
    setCases(prev => prev.map(c => c.id === updatedCase.id ? updatedCase : c));
  };

  const handleUpdateFinancials = (fin: FinancialData) => {
    const newOverallHealth = calculateOverallHealth(activeCase.healthInputs, fin);
    const updatedCase: CaseRecord = {
      ...activeCase,
      financials: fin,
      overallHealth: newOverallHealth,
      updatedAt: new Date().toISOString(),
    };
    saveCase(updatedCase);
    setActiveCase(updatedCase);
    setCases(prev => prev.map(c => c.id === updatedCase.id ? updatedCase : c));
  };

  const handlePrint = () => {
    setActiveTab('memo');
    setIsExportModalOpen(false);
    setTimeout(() => {
      window.print();
    }, 250);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Application Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeProfile={activeCase.profile}
        overallHealth={activeCase.overallHealth}
        onOpenCoachModal={() => {
          setCoachInitialPrompt(undefined);
          setActiveTab('aicoach');
        }}
        onOpenExportModal={() => setIsExportModalOpen(true)}
      />

      {/* Case Management Bar */}
      <CaseManagerBar
        cases={cases}
        activeCase={activeCase}
        onSwitchCase={handleSwitchCase}
        onNewCase={handleNewCase}
        onLoadDemoCase={handleLoadDemoCase}
        onDeleteCase={handleDeleteCase}
        onExportJson={handleExportJson}
        onImportJson={handleImportJson}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'essentials' && (
          <BusinessEssentialsView
            profile={activeCase.profile}
            onUpdateProfile={handleUpdateProfile}
            onProceedToHealth={() => setActiveTab('health')}
          />
        )}

        {activeTab === 'health' && (
          <BusinessHealthView
            profile={activeCase.profile}
            healthInputs={activeCase.healthInputs}
            overallHealth={activeCase.overallHealth}
            onUpdateInput={handleUpdateHealthInput}
            onRecalculateOverall={handleRecalculateOverall}
            onProceedToRecommendations={() => setActiveTab('recommendations')}
          />
        )}

        {activeTab === 'recommendations' && (
          <RecommendationView
            profile={activeCase.profile}
            healthInputs={activeCase.healthInputs}
            financials={activeCase.financials}
            overallHealth={activeCase.overallHealth}
            recommendations={activeCase.recommendations}
            onUpdateRecommendations={handleUpdateRecommendations}
            onNavigateToConsole={(prompt) => {
              setCoachInitialPrompt(prompt);
              setActiveTab('aicoach');
            }}
          />
        )}

        {activeTab === 'memo' && (
          <ExecutiveMemo
            activeCase={activeCase}
            onSwitchTab={(tab) => setActiveTab(tab)}
            onOpenCoachWithPrompt={(prompt) => {
              setCoachInitialPrompt(prompt);
              setActiveTab('aicoach');
            }}
          />
        )}

        {activeTab === 'cashflow' && (
          <CashFlowWorkbench
            caseRecord={activeCase}
            onUpdateFinancials={handleUpdateFinancials}
          />
        )}

        {activeTab === 'options' && (
          <OptionsEvaluationMatrix
            caseRecord={activeCase}
          />
        )}

        {activeTab === 'roadmap' && (
          <Roadmap90Day
            caseRecord={activeCase}
          />
        )}

        {activeTab === 'dashboard' && (
          <WeeklyDashboardView
            caseRecord={activeCase}
          />
        )}

        {activeTab === 'sprint' && (
          <SevenDaySprint
            caseRecord={activeCase}
          />
        )}

        {activeTab === 'aicoach' && (
          <AICoachConsole
            caseRecord={activeCase}
            initialPrompt={coachInitialPrompt}
            onUpdateCase={(updated) => {
              saveCase(updated);
              setActiveCase(updated);
            }}
          />
        )}
      </main>

      {/* Export Report Modal */}
      <ReportExportModal
        caseRecord={activeCase}
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onPrintReport={handlePrint}
      />

      {/* Footer */}
      <footer className="bg-slate-900/60 border-t border-slate-900 py-6 text-center text-xs text-slate-500 print:hidden">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Relaunch BizPulse © 2026 • Evidence-Based SME Turnaround & Diagnostic Operating System</span>
          <span className="text-slate-400">
            Active: <strong className="text-slate-200">{activeCase.profile.name}</strong> ({activeCase.profile.industry})
          </span>
        </div>
      </footer>
    </div>
  );
}

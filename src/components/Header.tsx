import React from 'react';
import { 
  Building2, 
  ShieldAlert, 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  Users, 
  CheckSquare, 
  Bot, 
  Printer, 
  Sparkles,
  BarChart3,
  Layers,
  Activity,
  FileText,
  Download,
  Target
} from 'lucide-react';
import { BusinessProfile, OverallHealthAssessment } from '../types/bizpulse';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeProfile: BusinessProfile;
  overallHealth: OverallHealthAssessment | null;
  isUnlocked?: boolean;
  onOpenCoachModal: () => void;
  onOpenExportModal: () => void;
  onOpenCheckoutModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  activeProfile,
  overallHealth,
  isUnlocked,
  onOpenCoachModal,
  onOpenExportModal,
  onOpenCheckoutModal
}) => {
  const tabs = [
    { id: 'essentials', label: '1. Essentials', icon: Building2 },
    { id: 'health', label: '2. Health (8D)', icon: Activity },
    { id: 'recommendations', label: '3. Recommendations', icon: Sparkles, isSpecial: true },
    { id: 'memo', label: 'Executive Report', icon: FileText },
    { id: 'cashflow', label: 'Cash & Working Capital', icon: DollarSign },
    { id: 'options', label: 'Options & Decisions', icon: BarChart3 },
    { id: 'roadmap', label: 'Action Plan', icon: Calendar },
    { id: 'dashboard', label: 'Weekly Dashboard', icon: TrendingUp },
    { id: 'aicoach', label: 'AI Coach Console', icon: Bot },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 text-white shadow-xl print:hidden">
      {/* Top Banner Context */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-600 flex items-center justify-center shadow-lg shadow-orange-500/20 text-white font-black text-xl shrink-0">
            BP
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-lg text-slate-100 tracking-tight">Relaunch BizPulse</span>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                SME Commercial Turnaround OS
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-blue-500/10 text-blue-300 border border-blue-500/20">
                {activeProfile.industry} • {activeProfile.currency}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 truncate max-w-xl">
              Active Business: <strong className="text-slate-200">{activeProfile.name}</strong> • Objective: {activeProfile.primaryObjective}
            </p>
          </div>
        </div>

        {/* Status Pills & Actions */}
        <div className="flex items-center gap-3">
          {overallHealth && (
            <div className="hidden lg:flex items-center space-x-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
              <span className="text-slate-400">Health:</span>
              <span className={`font-bold font-mono ${
                overallHealth.overallScore >= 70 ? 'text-emerald-400' :
                overallHealth.overallScore >= 45 ? 'text-amber-400' : 'text-rose-400'
              }`}>
                {overallHealth.overallScore}/100 ({overallHealth.overallRating})
              </span>
            </div>
          )}

          {/* License Status / Unlock Button */}
          {activeProfile.isDemonstrationCase ? (
            <span className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-300 border border-blue-500/20 text-xs font-semibold">
              <span>Benchmark Case</span>
            </span>
          ) : isUnlocked ? (
            <span className="hidden sm:flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>Diagnostic License: Active</span>
            </span>
          ) : (
            <button
              onClick={onOpenCheckoutModal}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition"
              title="Unlock full commercial diagnostic and executive reports"
            >
              <span>Unlock Diagnostic ({activeProfile.currency} $99)</span>
            </button>
          )}

          <button
            onClick={onOpenExportModal}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
            title="Export Word, PDF or Markdown report"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export Report</span>
          </button>

          <button
            onClick={onOpenCoachModal}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 text-xs font-bold shadow-md shadow-orange-500/20 transition transform active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ask Coach</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800/80">
        <nav className="flex space-x-1 overflow-x-auto py-2 scrollbar-none" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                } ${tab.isSpecial && !isActive ? 'text-orange-400 font-semibold' : ''}`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : ''}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

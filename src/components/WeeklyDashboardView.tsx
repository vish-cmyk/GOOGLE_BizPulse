import React from 'react';
import { 
  BarChart2, 
  TrendingUp, 
  ShieldAlert, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Calendar,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Activity
} from 'lucide-react';
import { WEEKLY_DASHBOARD_KPIS } from '../data/coachingBriefing';
import { WeeklyDashboardKPI, CaseRecord } from '../types/bizpulse';

interface WeeklyDashboardViewProps {
  caseRecord?: CaseRecord;
}

export const WeeklyDashboardView: React.FC<WeeklyDashboardViewProps> = ({ caseRecord }) => {
  return (
    <div className="space-y-6">
      {/* Top Banner Context */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Management Operating Rhythm
              </span>
              <span className="text-slate-400 text-xs">Section 10 Scoreboard</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              The Monday 9:00 AM Management Dashboard
            </h2>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              Six vital signs reviewed in a strictly time-boxed 45-minute standup every Monday. Clear targets, warning levels, critical redlines, and accountable roles to separate commercial facts from emotional anxiety.
            </p>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 min-w-[220px] text-center shadow-lg">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Weekly Cadence</span>
            <div className="text-lg font-bold text-slate-100 mt-1">
              Every Monday
            </div>
            <div className="text-xs text-amber-400 font-mono mt-0.5">
              9:00 AM – 9:45 AM (Strict)
            </div>
          </div>
        </div>
      </div>

      {/* 6 Core Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {WEEKLY_DASHBOARD_KPIS.map((kpi: WeeklyDashboardKPI, index: number) => {
          const isCritical = kpi.id === 'kpi-1' || kpi.id === 'kpi-2';
          return (
            <div
              key={kpi.id}
              className={`bg-slate-900/90 border rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all hover:border-slate-700 ${
                isCritical ? 'border-rose-800/40' : 'border-slate-800'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2 py-0.5 rounded bg-slate-800 font-mono">
                    {kpi.area}
                  </span>
                  <span className="text-xs font-medium text-blue-300">
                    Role: {kpi.accountableRole}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-slate-100 text-base">
                    {index + 1}. {kpi.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {kpi.explanation}
                  </p>
                </div>

                {/* Current Reported Value */}
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-xs font-medium text-slate-400 block">Reported Baseline:</span>
                  <div className={`text-sm font-bold font-mono ${isCritical ? 'text-rose-400' : 'text-amber-400'}`}>
                    {kpi.currentReportedValue}
                  </div>
                </div>

                {/* Target vs Critical Redline */}
                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-900/40">
                    <span className="text-emerald-400 font-bold block mb-0.5">Target Benchmark</span>
                    <span className="text-emerald-200 text-[11px]">{kpi.targetBenchmark}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-rose-950/30 border border-rose-900/40">
                    <span className="text-rose-400 font-bold block mb-0.5">Critical Redline</span>
                    <span className="text-rose-200 text-[11px]">{kpi.criticalThreshold}</span>
                  </div>
                </div>
              </div>

              {/* Threshold Criteria Explanation */}
              <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400">
                <span className="font-semibold text-slate-300">Classification Rationale: </span>
                {kpi.criteriaExplanation}
              </div>
            </div>
          );
        })}
      </div>

      {/* Monday Agenda Rules */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-base font-bold text-slate-100 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-amber-400" />
          The 45-Minute Monday Meeting Operating Protocol
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <span className="font-bold text-amber-400 text-sm block">1. Minutes 0–15: Cash & Credit Governance</span>
            <p className="text-slate-300 leading-relaxed">
              Review current bank balance, remaining overdraft headroom, and invoices overdue past 20 days. Confirm stop-work notices for accounts past 45 days. No informal exceptions without formal payment arrangements.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <span className="font-bold text-blue-400 text-sm block">2. Minutes 15–30: Top 12 Client & Service Health</span>
            <p className="text-slate-300 leading-relaxed">
              Review green/amber/red status across the Top 12 clients. Inspect ticket backlog and senior technician focus block adherence. Ensure no reactive fires displace planned billable projects.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <span className="font-bold text-emerald-400 text-sm block">3. Minutes 30–45: 3 Commitments for the Week</span>
            <p className="text-slate-300 leading-relaxed">
              Vish and partner agree on the top 3 tactical priorities each must complete by Friday 5:00 PM. No business problem discussions permitted after 6:30 PM during the week.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

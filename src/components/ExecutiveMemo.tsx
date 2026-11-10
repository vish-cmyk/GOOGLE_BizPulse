import React, { useState } from 'react';
import { 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  HelpCircle, 
  Layers, 
  TrendingUp, 
  ShieldAlert, 
  ArrowRight, 
  Printer, 
  Coins, 
  Scale, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Calculator, 
  UserCheck, 
  Clock, 
  Activity, 
  ArrowDownRight, 
  GitBranch, 
  ShieldCheck, 
  CheckCircle2, 
  AlertOctagon, 
  FileSpreadsheet,
  Building2,
  RefreshCw
} from 'lucide-react';
import { 
  REPORTED_FINANCIALS, 
  RISK_MAP_ITEMS, 
  GROWTH_OPTIONS_EVALUATION, 
  PRIORITISED_TURNAROUND_PLAN, 
  MISSING_INFORMATION_CHECKLIST, 
  WEEKLY_DASHBOARD_KPIS 
} from '../data/coachingBriefing';

import { CaseRecord } from '../types/bizpulse';

interface ExecutiveMemoProps {
  activeCase: CaseRecord;
  onSwitchTab: (tab: string) => void;
  onOpenCoachWithPrompt?: (prompt: string) => void;
}

export const ExecutiveMemo: React.FC<ExecutiveMemoProps> = ({ activeCase, onSwitchTab, onOpenCoachWithPrompt }) => {
  const [activeAccordion, setActiveAccordion] = useState<string | null>('sec-1');
  const isDemo = activeCase.profile.isDemonstrationCase;
  const p = activeCase.profile;
  const h = activeCase.overallHealth;
  const rec = activeCase.recommendations;

  const toggleAccordion = (id: string) => {
    setActiveAccordion(prev => prev === id ? null : id);
  };

  // If this is a custom business (not the MSP demonstration scenario), render the dynamic case-specific executive report
  if (!isDemo) {
    return (
      <div className="space-y-8 max-w-5xl mx-auto print:max-w-none print:text-black">
        {/* Top Header Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl print:border-none print:shadow-none print:p-0">
          <div className="border-b border-slate-800 pb-6 print:border-black">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  Custom Turnaround Diagnostic • Case: {p.caseId}
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-3 tracking-tight print:text-black">
                  {p.name}
                </h1>
                <p className="text-slate-400 text-sm mt-1 print:text-gray-700">
                  Commercial Turnaround Diagnostic & Strategic Action Report • {p.industry} ({p.country})
                </p>
              </div>
              <div className="text-right text-xs text-slate-400 space-y-1 print:text-gray-700">
                <div><strong className="text-slate-200">Date:</strong> {h?.assessmentDate || new Date().toISOString().split('T')[0]}</div>
                <div><strong className="text-slate-200">Currency:</strong> {p.currency} | <strong>Workforce:</strong> {p.employeeCount} Staff, {p.subcontractorCount} Subcontractors</div>
                <div><strong className="text-slate-200">Assessment:</strong> {h?.overallRating || 'Provisional (Pending)'}</div>
              </div>
            </div>
          </div>

          {/* Business Health Summary Strip */}
          <div className="mt-6 p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-amber-400" />
                <span className="font-bold text-white text-sm">Overall Business Health Assessment:</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  h?.overallRating === 'Healthy' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                  h?.overallRating === 'Needs Attention' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                  h?.overallRating === 'At Risk' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                  'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                }`}>
                  {h?.overallRating || 'Assessment In Progress'} {h ? `(${h.overallScore}/100)` : ''}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onSwitchTab('health')}
                  className="text-xs text-amber-400 hover:text-amber-300 underline font-medium"
                >
                  Edit 8 Dimensions
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
              <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-400 font-semibold block uppercase tracking-wider text-[11px]">Primary Commercial Objective</span>
                <p className="text-slate-200 font-medium">{p.primaryObjective}</p>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-amber-400 font-semibold block uppercase tracking-wider text-[11px]">Stated Primary Concern</span>
                <p className="text-slate-200 font-medium">{p.primaryConcern || 'Unspecified commercial pressure'}</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed pt-1">
              <strong>Diagnostic Synthesis: </strong>
              {h?.scoreLabel || 'Assessment pending completion of the 8 health dimensions.'}
              {' '}This diagnostic report is calibrated specifically for an enterprise in the <strong>{p.industry}</strong> sector operating in {p.country}.
            </p>
          </div>
        </div>

        {/* Section 2: The Eight Health Dimensions */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <span className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-300 font-bold text-xs flex items-center justify-center">
                1
              </span>
              <h3 className="text-lg font-bold text-white">The Eight Commercial Health Dimensions</h3>
            </div>
            <button
              onClick={() => onSwitchTab('health')}
              className="text-xs text-amber-400 hover:text-amber-300 font-medium"
            >
              Update Dimensions &rarr;
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px]">
                  <th className="py-2.5 px-3">Dimension</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Evidence Basis</th>
                  <th className="py-2.5 px-3">Owner-Reported Operational Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {Object.values(activeCase.healthInputs).map((dim) => (
                  <tr key={dim.key} className="hover:bg-slate-850/50 transition">
                    <td className="py-3 px-3 font-bold text-slate-200">
                      {dim.title}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        dim.status === 'healthy' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                        dim.status === 'needs_attention' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                        dim.status === 'at_risk' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                        dim.status === 'not_sure' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                        'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}>
                        {dim.status.toUpperCase().replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">
                      {dim.evidenceType.replace('_', ' ')}
                    </td>
                    <td className="py-3 px-3 text-slate-300 max-w-md">
                      {dim.notes || <span className="text-slate-600 italic">No notes supplied by owner</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Diagnostic Observation & AI Turnaround Recommendations */}
        <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-6 sm:p-8 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <span className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">
                2
              </span>
              <h3 className="text-lg font-bold text-white">Diagnostic Recommendations & Commercial Logic</h3>
            </div>
            <button
              onClick={() => onSwitchTab('recommendations')}
              className="text-xs text-amber-400 hover:text-amber-300 font-medium"
            >
              Full Recommendations Tab &rarr;
            </button>
          </div>

          {rec ? (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/40 space-y-1.5">
                <span className="font-bold text-amber-400 uppercase tracking-wider text-[11px] block">
                  Primary Commercial Observation:
                </span>
                <p className="text-sm font-semibold text-white leading-relaxed">{rec.initialObservation}</p>
                <div className="pt-2 text-slate-300 border-t border-slate-800/80">
                  <strong className="text-amber-300">Why It Matters: </strong>
                  {rec.commercialWhy}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-emerald-800/40 space-y-1.5">
                  <span className="font-bold text-emerald-400 uppercase tracking-wider text-[11px] block">
                    Strategic Recommendation:
                  </span>
                  <p className="text-slate-200 leading-relaxed">{rec.initialRecommendation}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-emerald-800/40 space-y-1.5">
                  <span className="font-bold text-emerald-400 uppercase tracking-wider text-[11px] block flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    Immediate 48–72 Hour Action:
                  </span>
                  <p className="text-emerald-300 font-semibold leading-relaxed">{rec.immediateAction}</p>
                </div>
              </div>

              {rec.specialistAdviceNeeded && (
                <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-900/30 text-amber-200 flex items-start gap-2">
                  <Scale className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-amber-300">Specialist Advisory Trigger: </strong>
                    {rec.specialistAdviceNeeded}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-3">
              <p className="text-slate-400 text-xs">
                AI Diagnostic Recommendations have not yet been synthesized for {p.name}.
              </p>
              <button
                onClick={() => onSwitchTab('recommendations')}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate Recommendations Now</span>
              </button>
            </div>
          )}
        </div>

        {/* Section 4: Evidence Standards & Information Gaps */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-800">
            <span className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-300 font-bold text-xs flex items-center justify-center">
              3
            </span>
            <h3 className="text-lg font-bold text-white">Evidence Standards & Information Quality</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <span className="font-bold text-emerald-400 uppercase tracking-wider block">Owner-Reported Knowns</span>
              <p className="text-slate-400">
                Operating history: {p.yearsOperating} years. Team size: {p.employeeCount} staff. Primary stated issue: {p.primaryConcern || 'Operational strain'}.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <span className="font-bold text-amber-400 uppercase tracking-wider block">Working Assumptions</span>
              <p className="text-slate-400">
                Current financial indicators are preliminary and subject to reconciliation with your external accountant and banking facilities.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <span className="font-bold text-blue-400 uppercase tracking-wider block">Critical Missing Evidence</span>
              <p className="text-slate-400">
                Accurate aged debtors ledger, customer-level gross contribution margins, and verified near-term cash liabilities.
              </p>
            </div>
          </div>
        </div>

        {/* Section 5: Commercial Navigation Tools Callout */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-amber-950/20 to-slate-900 border border-amber-500/30 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Next Action</span>
            <h4 className="text-base font-bold text-white">Explore Interactive Financial Workbenches</h4>
            <p className="text-xs text-slate-400 max-w-xl">
              Model your cash flow deficit, test price realignment scenarios, or review the weekly management scoreboard for {p.name}.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onSwitchTab('cashflow')}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
            >
              Cash Workbench
            </button>
            <button
              onClick={() => onSwitchTab('clients')}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
            >
              Customer Matrix
            </button>
            <button
              onClick={() => onSwitchTab('aicoach')}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition"
            >
              Consult AI Coach
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // DEMONSTRATION CASE: NZ IT MANAGED SERVICES PROVIDER (10-SECTION MASTER MEMO)
  // =========================================================================
  return (
    <div className="space-y-8 max-w-5xl mx-auto print:max-w-none print:text-black">
      
      {/* Top Banner Alert for Demo Case */}
      <div className="bg-slate-900 border border-blue-500/40 rounded-2xl p-6 sm:p-8 shadow-2xl print:border-none print:shadow-none print:p-0">
        <div className="border-b border-slate-800 pb-6 print:border-black">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                  Executive Turnaround Advisory Document
                </span>
                <span className="text-xs font-bold uppercase tracking-widest text-blue-300 bg-blue-500/20 px-3 py-1 rounded-full border border-blue-500/30">
                  Demonstration Case: NZ MSP
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-3 tracking-tight print:text-black">
                Relaunch BizPulse: Comprehensive Commercial Turnaround Diagnostic
              </h1>
              <p className="text-slate-400 text-sm mt-1 print:text-gray-700">
                Prepared for Vish & Managing Partner • B2B IT Managed Services Provider (New Zealand)
              </p>
            </div>
            <div className="text-right text-xs text-slate-400 space-y-1 print:text-gray-700">
              <div><strong className="text-slate-200">Date:</strong> 14 October 2026</div>
              <div><strong className="text-slate-200">Currency:</strong> NZD (NZ$) | <strong>Team:</strong> 12 Staff + 2 Subcontractors</div>
              <div><strong className="text-slate-200">Status:</strong> Provisional Diagnostic (Subject to Debtor Verification)</div>
            </div>
          </div>
        </div>

        {/* Provisional Business Health Gauge */}
        <div className="mt-6 p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-amber-400" />
              <span className="font-bold text-white text-sm">Provisional Overall Business-Health Assessment:</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                AMBER-CAUTION (Working-Capital & Operational Strain)
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">Classification Criteria Below</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="p-3 bg-emerald-950/20 border border-emerald-900/30 rounded-lg text-slate-300">
              <strong className="text-emerald-400 block mb-1">GREEN Criteria (Healthy):</strong>
              Cash buffer &gt; 8 weeks opex, zero overdraft drawn, debtors &lt; 30 days DSO, unconstrained tech capacity.
            </div>
            <div className="p-3 bg-amber-950/20 border border-amber-900/40 rounded-lg text-slate-200">
              <strong className="text-amber-400 block mb-1">AMBER Criteria (Current State):</strong>
              Reported profit positive on paper, but overdraft &gt; 65% drawn, debtors &gt; 45 days, single point of failure in tech delivery.
            </div>
            <div className="p-3 bg-rose-950/20 border border-rose-900/30 rounded-lg text-slate-300">
              <strong className="text-rose-400 block mb-1">RED Criteria (Crisis):</strong>
              Overdraft facility maxed, active supplier delivery holds, uncollectable bad debts &gt; NZ$30k, debt defaults.
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed pt-1">
            <strong>Diagnostic Synthesis: </strong>
            The business is <em>not</em> fundamentally unviable. It possesses an 8-year operating track record, an established recurring customer base, and reported positive pre-tax earnings of NZ$100,000. However, it is experiencing a <strong>pronounced cash-conversion and working-capital lag</strong>: NZ$175,000 in receivables (with NZ$58,000 reported overdue past 60 days) has forced reliance on an expensive NZ$52,000 bank overdraft against a NZ$75,000 limit. Simultaneously, contract pricing frozen for 3 years alongside unbilled scope creep has compressed technician capacity, causing staff friction and partner exhaustion.
          </p>
        </div>
      </div>

      {/* SECTION 2: BUSINESS SNAPSHOT & EVIDENCE QUALITY */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <button
          onClick={() => toggleAccordion('sec-2')}
          className="w-full p-6 text-left flex items-center justify-between bg-slate-850 hover:bg-slate-800/80 transition border-b border-slate-800"
        >
          <div className="flex items-center space-x-3">
            <span className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-300 font-bold text-sm flex items-center justify-center">
              2
            </span>
            <div>
              <h2 className="text-lg font-bold text-white">
                Business Snapshot & Evidence Quality
              </h2>
              <p className="text-xs text-slate-400">
                Separating Independently Established Facts from Reported Unverified Information and Missing Evidence
              </p>
            </div>
          </div>
          {activeAccordion === 'sec-2' ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
        </button>

        {activeAccordion === 'sec-2' && (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-emerald-800/40 space-y-2">
                <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                  <CheckCircle className="w-4 h-4" />
                  <span>Category A: Verified Baseline</span>
                </div>
                <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                  <li>8 years in business; 48 active customers.</li>
                  <li>12 employees (including 2 owners) + 2 subcontractors.</li>
                  <li>NZ$75,000 bank overdraft facility exists.</li>
                  <li>NZ$38,000 cash in operating accounts.</li>
                  <li>Standard customer payment terms: 20 days.</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-amber-800/40 space-y-2">
                <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                  <HelpCircle className="w-4 h-4" />
                  <span>Category B: Reported (Unverified)</span>
                </div>
                <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                  <li>Annual revenue: NZ$1.28M; Operating profit: NZ$100k.</li>
                  <li>NZ$175,000 receivables; NZ$58,000 &gt;60 days overdue.</li>
                  <li>NZ$52,000 overdraft drawn balance.</li>
                  <li>Top 5 customers = 38% revenue; Top 12 = 60% MRR.</li>
                  <li>Labour and vendor costs up ~15%+ over 36 months.</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-blue-800/40 space-y-2">
                <div className="flex items-center space-x-2 text-blue-400 font-bold text-xs uppercase tracking-wider">
                  <SearchIcon className="w-4 h-4" />
                  <span>Category C: Missing Evidence</span>
                </div>
                <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                  <li>Aged receivables ledger with dispute tags.</li>
                  <li>Gross margin per contract and customer effective hourly rate.</li>
                  <li>Billable technical utilization rates by technician.</li>
                  <li>Renewal dates for top 5 anchor accounts.</li>
                  <li>Detailed 4-week cash commitments schedule.</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 3: CORE COMMERCIAL CONTRADICTION & ROOT-CAUSE ANALYSIS */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <button
          onClick={() => toggleAccordion('sec-3')}
          className="w-full p-6 text-left flex items-center justify-between bg-slate-850 hover:bg-slate-800/80 transition border-b border-slate-800"
        >
          <div className="flex items-center space-x-3">
            <span className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-300 font-bold text-sm flex items-center justify-center">
              3
            </span>
            <div>
              <h2 className="text-lg font-bold text-white">
                Core Commercial Contradiction: Paper Profit vs. Cash Pressure
              </h2>
              <p className="text-xs text-slate-400">
                Why Reported Accounting Profit is Failing to Reach the Bank Account
              </p>
            </div>
          </div>
          {activeAccordion === 'sec-3' ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
        </button>

        {activeAccordion === 'sec-3' && (
          <div className="p-6 space-y-5 text-xs text-slate-300 leading-relaxed">
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
              <h4 className="font-bold text-white text-sm">The Mechanism of Cash Trapping</h4>
              <p>
                The owner reports an operating profit of NZ$100,000 on revenue of NZ$1.28 million (a 7.8% margin). In accrual accounting, revenue is recognized when invoiced, regardless of payment. Because customer payment cycles average 45–75 days, working capital is consumed in financing customer operations:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Uncollected Paper Profit</span>
                  <span className="text-lg font-bold text-rose-400 font-mono mt-0.5 block">NZ$175,000</span>
                  <span className="text-[10px] text-slate-500">Trapped in client receivables</span>
                </div>
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Immediate Cash Shortfall</span>
                  <span className="text-lg font-bold text-rose-400 font-mono mt-0.5 block">-NZ$54,000</span>
                  <span className="text-[10px] text-slate-500">Cash ($38k) minus Payables ($92k)</span>
                </div>
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Bank Overdraft Utilized</span>
                  <span className="text-lg font-bold text-amber-400 font-mono mt-0.5 block">NZ$52,000</span>
                  <span className="text-[10px] text-slate-500">69.3% of NZ$75k credit ceiling</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <h4 className="font-bold text-slate-200 text-sm">Four Interlocking Root Drivers</h4>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-300">
                <li><strong>Unenforced Credit Policy: </strong> Continued delivery of active IT support to customers 60+ days delinquent out of fear of churn.</li>
                <li><strong>Unbilled Hardware Procurement: </strong> Purchasing customer laptops and cloud licenses on 30-day supplier terms while billing customers in arrears.</li>
                <li><strong>Contract Margin Compression: </strong> 3-year pricing freeze combined with ~15% inflation in wages and Microsoft licensing costs.</li>
                <li><strong>Unmeasured Scope Creep: </strong> Out-of-scope work absorbed under fixed monthly fees without change orders or supplemental billing.</li>
              </ol>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 4: THE INTEGRATED COMMERCIAL RISK MAP */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <button
          onClick={() => toggleAccordion('sec-4')}
          className="w-full p-6 text-left flex items-center justify-between bg-slate-850 hover:bg-slate-800/80 transition border-b border-slate-800"
        >
          <div className="flex items-center space-x-3">
            <span className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 font-bold text-sm flex items-center justify-center">
              4
            </span>
            <div>
              <h2 className="text-lg font-bold text-white">
                Integrated Commercial Risk Map (Cause-and-Effect Chain)
              </h2>
              <p className="text-xs text-slate-400">
                Interconnected Failure Modes: Cash Lag, Key-Person Bottlenecks, and Margin Erosion
              </p>
            </div>
          </div>
          {activeAccordion === 'sec-4' ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
        </button>

        {activeAccordion === 'sec-4' && (
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {RISK_MAP_ITEMS.map((item) => (
                <div key={item.id} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
                      {item.category}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      {item.urgency}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-semibold text-white text-xs">Reported Symptom:</h4>
                    <p className="text-xs text-slate-300">{item.reportedSymptom}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80">
                    <span className="text-[11px] font-bold text-slate-400 block">Underlying Commercial Cause:</span>
                    <p className="text-xs text-slate-300">{item.possibleUnderlyingCause}</p>
                  </div>

                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-[11px] text-emerald-300">
                    <strong>Recommended First Action: </strong> {item.recommendedFirstAction}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* SECTION 5: GROWTH INVESTMENT COMPARISON (OPTION A, B, AND C) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <button
          onClick={() => toggleAccordion('sec-5')}
          className="w-full p-6 text-left flex items-center justify-between bg-slate-850 hover:bg-slate-800/80 transition border-b border-slate-800"
        >
          <div className="flex items-center space-x-3">
            <span className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-300 font-bold text-sm flex items-center justify-center">
              5
            </span>
            <div>
              <h2 className="text-lg font-bold text-white">
                Growth Investment Comparison: Option A vs. Option B vs. Option C
              </h2>
              <p className="text-xs text-slate-400">
                Objective Evaluation of Marketing Agency, Salesperson Hire, and Core Margin Turnaround
              </p>
            </div>
          </div>
          {activeAccordion === 'sec-5' ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
        </button>

        {activeAccordion === 'sec-5' && (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {GROWTH_OPTIONS_EVALUATION.map((opt) => (
                <div key={opt.id} className="p-5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                      {opt.id}
                    </span>
                    <h3 className="font-bold text-white text-sm">{opt.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{opt.proposedAction}</p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
                    <div>
                      <span className="text-slate-500 font-medium block">Upfront Cash Outlay:</span>
                      <span className="text-slate-200 font-mono text-[11px]">{opt.upfrontCashRequirement}</span>
                    </div>

                    <div>
                      <span className="text-slate-500 font-medium block">Route to Cash Collection:</span>
                      <p className="text-slate-400 text-[11px] leading-relaxed">{opt.routeToRevenueAndCash}</p>
                    </div>

                    <div className="p-2.5 rounded bg-slate-900 border border-slate-800 space-y-1">
                      <span className="font-bold text-amber-400 block text-[11px]">Break-Even Calculation Framework:</span>
                      <p className="font-mono text-slate-300 text-[10px]">{opt.calculationFramework.formula}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-xs text-emerald-200 space-y-1">
              <strong className="text-emerald-300 font-semibold block text-sm">Advisory Verdict on Capital Commitments:</strong>
              <p className="leading-relaxed">
                Options A (Marketing) and B (Salesperson) must be <strong>DEFERRED</strong>. Injecting leads into a service desk experiencing technician flight risk and key-person delivery bottlenecks will accelerate customer churn and drain remaining bank headroom. Implement <strong>Option C (Core Margin Turnaround)</strong> immediately to restore positive liquidity.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 6: MANAGEMENT RECOMMENDATIONS & 48-HOUR GATES */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-amber-950/30 to-slate-900 border border-amber-500/30 shadow-2xl space-y-4">
        <div className="flex items-center space-x-2 text-amber-400 font-bold text-base">
          <ShieldCheck className="w-6 h-6 text-amber-400" />
          <span>Direct Commercial Recommendation for Vish & Managing Partner</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2 text-xs text-slate-300">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
            <strong className="text-emerald-400 font-bold block text-sm">1. What to Do First</strong>
            <p className="leading-relaxed">
              Verify the aged debtors ledger over the next 48 hours. Isolate the collectable portion of the NZ$58k overdue debt and initiate direct telephone contact on the top 5 accounts to secure immediate cash commitments.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
            <strong className="text-rose-400 font-bold block text-sm">2. What NOT to Commit</strong>
            <p className="leading-relaxed">
              Do not commit to the NZ$20k marketing agency spend or the NZ$85k salesperson recruitment. Committing capital before verifying cash flow and gross margins risks exhausting the remaining NZ$23k overdraft buffer.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
            <strong className="text-amber-400 font-bold block text-sm">3. Immediate Evidence Needed</strong>
            <p className="leading-relaxed">
              Supply the aged receivables detail report, the 4-week cash commitments schedule (net payroll, GST/PAYE, supplier POs), and the contract renewal dates for the 5 largest customers.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
            <strong className="text-blue-400 font-bold block text-sm">4. Next Decision Gate</strong>
            <p className="leading-relaxed">
              Re-evaluate discretionary growth investments at Day 60, upon verifying: (a) overdraft reduced below NZ$20k, (b) customer margin matrix completed, and (c) senior tech focus window operating.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

function SearchIcon(props: any) {
  return <HelpCircle {...props} />;
}

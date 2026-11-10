import React, { useState } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  HelpCircle, 
  ShieldAlert, 
  DollarSign, 
  ArrowRight,
  Filter,
  Check,
  AlertTriangle,
  Calculator,
  GitBranch,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { GROWTH_OPTIONS_EVALUATION } from '../data/coachingBriefing';
import { CaseRecord } from '../types/bizpulse';

interface OptionsEvaluationMatrixProps {
  caseRecord?: CaseRecord;
}

export const OptionsEvaluationMatrix: React.FC<OptionsEvaluationMatrixProps> = ({ caseRecord }) => {
  const [selectedOptionId, setSelectedOptionId] = useState<'Option A' | 'Option B' | 'Option C'>('Option C');

  const selectedOption = GROWTH_OPTIONS_EVALUATION.find(o => o.id === selectedOptionId) || GROWTH_OPTIONS_EVALUATION[2];

  return (
    <div className="space-y-6">
      {/* Top Banner Context */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Objective Commercial Appraisal
              </span>
              <span className="text-slate-400 text-xs">Section 5 Analysis</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Growth Investment Decision Engine: Option A vs. Option B vs. Option C
            </h2>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              Evaluating proposed capital commitments objectively without pre-determined bias. What must be true for each option to work, transparent calculation models, and explicit approval/deferral/rejection conditions.
            </p>
          </div>

          {/* Quick Select Buttons */}
          <div className="flex items-center gap-2">
            {(['Option A', 'Option B', 'Option C'] as const).map((optId) => (
              <button
                key={optId}
                onClick={() => setSelectedOptionId(optId)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  selectedOptionId === optId
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {optId}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3 Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {GROWTH_OPTIONS_EVALUATION.map((opt) => {
          const isSelected = selectedOptionId === opt.id;
          return (
            <div
              key={opt.id}
              onClick={() => setSelectedOptionId(opt.id)}
              className={`p-5 rounded-2xl cursor-pointer transition-all border flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-850 border-amber-500 shadow-xl ring-1 ring-amber-500/50'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-850/60'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-slate-800 text-slate-300 font-mono">
                    {opt.id}
                  </span>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    opt.id === 'Option C' 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {opt.id === 'Option C' ? 'Primary Recommendation' : 'High Risk / Premature'}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-white text-sm line-clamp-2">
                    {opt.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {opt.proposedAction}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 space-y-1.5 text-xs">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-500">Upfront Cash:</span>
                  <span className="text-slate-200 font-mono">{opt.id === 'Option A' ? 'NZ$20,000' : opt.id === 'Option B' ? 'NZ$15k–$20k setup' : 'NZ$0'}</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-500">Ongoing Cost:</span>
                  <span className="text-slate-200 font-mono">{opt.id === 'Option A' ? 'NZ$3k–$6k/mo' : opt.id === 'Option B' ? '~NZ$7,460/mo' : 'Management Time'}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Option Comprehensive Inspection */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-3">
              <span className="px-3 py-1 rounded-lg bg-amber-500 text-slate-950 font-black text-sm">
                {selectedOption.id}
              </span>
              <h3 className="text-xl font-bold text-white">
                {selectedOption.title}
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1.5 max-w-3xl leading-relaxed">
              {selectedOption.proposedAction}
            </p>
          </div>

          <div className="text-xs font-mono bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Cash Commitment</span>
            <span className="text-slate-200 font-semibold">{selectedOption.upfrontCashRequirement}</span>
          </div>
        </div>

        {/* 4 Core Analysis Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* Block 1: What Must Be True */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <h4 className="font-bold text-emerald-400 text-sm flex items-center gap-1.5 uppercase tracking-wider">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              What Must Be True for This Option to Work
            </h4>
            <ul className="space-y-1.5 text-slate-300 pt-1">
              {selectedOption.whatMustBeTrue.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Block 2: Commercial Assumptions to Test */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <h4 className="font-bold text-amber-400 text-sm flex items-center gap-1.5 uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Commercial Assumptions That Need Testing
            </h4>
            <ul className="space-y-1.5 text-slate-300 pt-1">
              {selectedOption.commercialAssumptionsToTest.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">?</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Block 3: Expected Route to Revenue & Cash */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <h4 className="font-bold text-blue-400 text-sm flex items-center gap-1.5 uppercase tracking-wider">
              <Clock className="w-4 h-4 text-blue-400" />
              Expected Route to Revenue and Cash Collection
            </h4>
            <p className="text-slate-300 leading-relaxed pt-1">
              {selectedOption.routeToRevenueAndCash}
            </p>
          </div>

          {/* Block 4: Principal Risks */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <h4 className="font-bold text-rose-400 text-sm flex items-center gap-1.5 uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              Principal Commercial & Financial Risks
            </h4>
            <ul className="space-y-1.5 text-slate-300 pt-1">
              {selectedOption.principalRisks.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">!</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Calculation Framework */}
        <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
            <Calculator className="w-4 h-4 text-amber-400" />
            <span>Transparent Break-Even Calculation Framework</span>
          </div>

          <div className="p-3 bg-slate-900 rounded-lg font-mono text-emerald-300 text-xs">
            {selectedOption.calculationFramework.formula}
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {selectedOption.calculationFramework.explanation}
          </p>

          <div className="pt-2 text-xs text-slate-400">
            <strong className="text-slate-200">Exact Inputs Required from Owner: </strong>
            {selectedOption.calculationFramework.requiredInputs.join(' • ')}
          </div>
        </div>

        {/* Decision Gates: Approval / Deferral / Rejection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs">
          <div className="p-3.5 bg-emerald-950/20 border border-emerald-900/30 rounded-xl space-y-1">
            <span className="font-bold text-emerald-400 uppercase tracking-wider block">Approval Conditions:</span>
            <ul className="space-y-1 text-slate-300">
              {selectedOption.approvalConditions.map((c, i) => (
                <li key={i}>• {c}</li>
              ))}
            </ul>
          </div>

          <div className="p-3.5 bg-amber-950/20 border border-amber-900/30 rounded-xl space-y-1">
            <span className="font-bold text-amber-400 uppercase tracking-wider block">Deferral Conditions:</span>
            <ul className="space-y-1 text-slate-300">
              {selectedOption.deferralConditions.map((c, i) => (
                <li key={i}>• {c}</li>
              ))}
            </ul>
          </div>

          <div className="p-3.5 bg-rose-950/20 border border-rose-900/30 rounded-xl space-y-1">
            <span className="font-bold text-rose-400 uppercase tracking-wider block">Rejection Conditions:</span>
            <ul className="space-y-1 text-slate-300">
              {selectedOption.rejectionConditions.map((c, i) => (
                <li key={i}>• {c}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

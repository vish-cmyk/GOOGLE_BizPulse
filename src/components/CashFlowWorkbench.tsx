import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  ArrowRight, 
  Zap, 
  ShieldCheck, 
  HelpCircle,
  Clock,
  Coins,
  Edit3,
  Save,
  RotateCcw
} from 'lucide-react';
import { REPORTED_FINANCIALS } from '../data/coachingBriefing';
import { CaseRecord, FinancialData } from '../types/bizpulse';

interface CashFlowWorkbenchProps {
  caseRecord?: CaseRecord;
  onUpdateFinancials?: (updated: FinancialData) => void;
}

export const CashFlowWorkbench: React.FC<CashFlowWorkbenchProps> = ({
  caseRecord,
  onUpdateFinancials
}) => {
  const profile = caseRecord?.profile;
  const isDemo = profile?.isDemonstrationCase ?? true;
  const currency = profile?.currency || 'NZD';

  // Base reported figures (editable for any business)
  const [cash, setCash] = useState<number>(() => {
    if (caseRecord?.financials?.cashInBank != null) return caseRecord.financials.cashInBank;
    return isDemo ? REPORTED_FINANCIALS.cashInBank : 35000;
  });

  const [overdraftUsed, setOverdraftUsed] = useState<number>(() => {
    if (caseRecord?.financials?.creditFacilityUsed != null) return caseRecord.financials.creditFacilityUsed;
    return isDemo ? REPORTED_FINANCIALS.overdraftUsed : 45000;
  });

  const [overdraftLimit, setOverdraftLimit] = useState<number>(() => {
    if (caseRecord?.financials?.creditFacilityLimit != null) return caseRecord.financials.creditFacilityLimit;
    return isDemo ? REPORTED_FINANCIALS.overdraftLimit : 60000;
  });

  const [payables, setPayables] = useState<number>(() => {
    if (caseRecord?.financials?.accountsPayable != null) return caseRecord.financials.accountsPayable;
    return isDemo ? REPORTED_FINANCIALS.supplierPayables : 55000;
  });

  const [totalAR, setTotalAR] = useState<number>(() => {
    if (caseRecord?.financials?.accountsReceivable != null) return caseRecord.financials.accountsReceivable;
    return isDemo ? REPORTED_FINANCIALS.accountsReceivable : 120000;
  });

  const [overdue60, setOverdue60] = useState<number>(() => {
    if (caseRecord?.financials?.overdueReceivables != null) return caseRecord.financials.overdueReceivables;
    return isDemo ? REPORTED_FINANCIALS.overdue60Days : 38000;
  });

  const [isEditingBaseline, setIsEditingBaseline] = useState<boolean>(false);
  const [baselineSavedAlert, setBaselineSavedAlert] = useState<boolean>(false);

  // Sync when active case changes
  useEffect(() => {
    if (caseRecord?.financials?.cashInBank != null) {
      setCash(caseRecord.financials.cashInBank);
      setOverdraftUsed(caseRecord.financials.creditFacilityUsed ?? 0);
      setOverdraftLimit(caseRecord.financials.creditFacilityLimit ?? 50000);
      setPayables(caseRecord.financials.accountsPayable ?? 0);
      setTotalAR(caseRecord.financials.accountsReceivable ?? 0);
      setOverdue60(caseRecord.financials.overdueReceivables ?? 0);
    } else if (isDemo) {
      setCash(REPORTED_FINANCIALS.cashInBank);
      setOverdraftUsed(REPORTED_FINANCIALS.overdraftUsed);
      setOverdraftLimit(REPORTED_FINANCIALS.overdraftLimit);
      setPayables(REPORTED_FINANCIALS.supplierPayables);
      setTotalAR(REPORTED_FINANCIALS.accountsReceivable);
      setOverdue60(REPORTED_FINANCIALS.overdue60Days);
    }
  }, [caseRecord?.id]);

  // Interactive recovery simulator states
  const [recoveredPercent, setRecoveredPercent] = useState<number>(65);
  const [hardwarePolicyEnforced, setHardwarePolicyEnforced] = useState<boolean>(true);
  const [monthlyHardwareVolume, setMonthlyHardwareVolume] = useState<number>(25000);
  const [overdraftRatePercent] = useState<number>(12.8); // Typical commercial overdraft rate

  // Calculations under recovery simulation
  const recoveredAmount = Math.round((overdue60 * recoveredPercent) / 100);
  
  // Simulated overdraft payoff
  const simulatedOverdraftUsed = Math.max(0, overdraftUsed - recoveredAmount);
  const excessCashFromRecovery = Math.max(0, recoveredAmount - overdraftUsed);
  const simulatedCash = cash + excessCashFromRecovery;
  const simulatedHeadroom = overdraftLimit - simulatedOverdraftUsed;

  // Annual overdraft interest savings
  const annualInterestCurrent = (overdraftUsed * (overdraftRatePercent / 100));
  const annualInterestSimulated = (simulatedOverdraftUsed * (overdraftRatePercent / 100));
  const annualInterestSaved = annualInterestCurrent - annualInterestSimulated;

  // Inventory / Hardware float unlocked
  const hardwareFloatUnlocked = hardwarePolicyEnforced ? monthlyHardwareVolume : 0;

  // Net immediate liquidity position
  const currentNetLiquidity = cash - payables;
  const simulatedNetLiquidity = simulatedCash - payables;

  const handleSaveCustomBaseline = () => {
    setIsEditingBaseline(false);
    setBaselineSavedAlert(true);
    setTimeout(() => setBaselineSavedAlert(false), 3000);

    if (onUpdateFinancials) {
      onUpdateFinancials({
        annualRevenue: caseRecord?.financials?.annualRevenue ?? 1000000,
        directCosts: caseRecord?.financials?.directCosts ?? 600000,
        operatingExpenses: caseRecord?.financials?.operatingExpenses ?? 300000,
        operatingProfit: caseRecord?.financials?.operatingProfit ?? 100000,
        cashInBank: cash,
        accountsReceivable: totalAR,
        overdueReceivables: overdue60,
        accountsPayable: payables,
        creditFacilityLimit: overdraftLimit,
        creditFacilityUsed: overdraftUsed,
        customerCount: caseRecord?.financials?.customerCount ?? 40,
        top5ConcentrationPercent: caseRecord?.financials?.top5ConcentrationPercent ?? 35,
        top12ConcentrationPercent: caseRecord?.financials?.top12ConcentrationPercent ?? 60,
        standardPaymentTermsDays: caseRecord?.financials?.standardPaymentTermsDays ?? 20,
        actualPaymentDelayDays: caseRecord?.financials?.actualPaymentDelayDays ?? 55,
        pricingReviewLastYears: caseRecord?.financials?.pricingReviewLastYears ?? 3,
      });
    }
  };

  const handleResetToDemo = () => {
    setCash(REPORTED_FINANCIALS.cashInBank);
    setOverdraftUsed(REPORTED_FINANCIALS.overdraftUsed);
    setOverdraftLimit(REPORTED_FINANCIALS.overdraftLimit);
    setPayables(REPORTED_FINANCIALS.supplierPayables);
    setTotalAR(REPORTED_FINANCIALS.accountsReceivable);
    setOverdue60(REPORTED_FINANCIALS.overdue60Days);
    setIsEditingBaseline(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Alert */}
      <div className="bg-gradient-to-r from-rose-950/60 via-slate-900 to-amber-950/40 border border-rose-800/40 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
                Pillar 1: Solvency Triage
              </span>
              <span className="text-slate-400 text-xs">Direct Commercial Diagnosis</span>
              {isDemo ? (
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Demo Case (NZ MSP)
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {profile?.name}
                </span>
              )}
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Working Capital Deficit & Cash Conversion Engine
            </h2>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              Available cash: <span className="font-semibold text-amber-300">{currency} {cash.toLocaleString()}</span>, credit facility: <span className="font-semibold text-rose-400">{currency} {overdraftUsed.toLocaleString()} drawn</span>, payables owed: <span className="font-semibold text-rose-400">{currency} {payables.toLocaleString()}</span>. 
              Net immediate liquidity position: <span className={`font-bold ${currentNetLiquidity < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {currentNetLiquidity < 0 ? '-' : '+'}{currency} {Math.abs(currentNetLiquidity).toLocaleString()}
              </span>.
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-4 min-w-[240px] text-center shadow-lg">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Remaining Facility Headroom</span>
              <div className="text-3xl font-extrabold text-amber-400 mt-1">
                {currency} {(overdraftLimit - overdraftUsed).toLocaleString()}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                of {currency} {overdraftLimit.toLocaleString()} total facility
              </div>
            </div>

            <button
              onClick={() => setIsEditingBaseline(!isEditingBaseline)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
            >
              <Edit3 className="w-3.5 h-3.5 text-amber-400" />
              <span>{isEditingBaseline ? 'Hide Baseline Inputs' : 'Edit Working Capital Baseline'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Editable Baseline Drawer */}
      {isEditingBaseline && (
        <div className="bg-slate-900 border border-amber-500/40 rounded-2xl p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-amber-400" />
                Customize Working Capital Ledger Figures
              </h3>
              <p className="text-xs text-slate-400">
                Calibrate the workbench to your company&apos;s real bank account and creditor balances ({currency}).
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleResetToDemo}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-300 hover:bg-slate-700 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Demo Data</span>
              </button>
              <button
                onClick={handleSaveCustomBaseline}
                className="flex items-center space-x-1.5 px-4 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Baseline</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Available Cash in Bank ({currency})</label>
              <input
                type="number"
                value={cash}
                onChange={(e) => setCash(Number(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Overdraft / Credit Facility Used ({currency})</label>
              <input
                type="number"
                value={overdraftUsed}
                onChange={(e) => setOverdraftUsed(Number(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Total Credit Facility Limit ({currency})</label>
              <input
                type="number"
                value={overdraftLimit}
                onChange={(e) => setOverdraftLimit(Number(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Outstanding Supplier Payables ({currency})</label>
              <input
                type="number"
                value={payables}
                onChange={(e) => setPayables(Number(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Total Outstanding Customer Invoices ({currency})</label>
              <input
                type="number"
                value={totalAR}
                onChange={(e) => setTotalAR(Number(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Invoices Delinquent &gt;60 Days ({currency})</label>
              <input
                type="number"
                value={overdue60}
                onChange={(e) => setOverdue60(Number(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>
      )}

      {baselineSavedAlert && (
        <div className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 p-3 rounded-xl text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Working capital baseline saved successfully. All downstream models updated.</span>
        </div>
      )}

      {/* 4 Core Financial Vital Signs Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Cash vs Payables */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Available Cash</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100 mt-2">
            {currency} {cash.toLocaleString()}
          </div>
          <div className="mt-3 text-xs text-rose-400 flex items-center gap-1 font-medium">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{currency} {payables.toLocaleString()} payables waiting</span>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Net immediate cash: <span className={`font-semibold font-mono ${currentNetLiquidity < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {currentNetLiquidity < 0 ? '-' : '+'}{currency} {Math.abs(currentNetLiquidity).toLocaleString()}
            </span>
          </div>
        </div>

        {/* 2. Overdraft Exposure */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Credit Facility Drawn</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400 mt-2">
            {currency} {overdraftUsed.toLocaleString()}
          </div>
          <div className="mt-3 w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-amber-500 h-full rounded-full transition-all"
              style={{ width: `${Math.min(100, (overdraftUsed / (overdraftLimit || 1)) * 100)}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between text-xs text-slate-400">
            <span>Limit: {currency} {overdraftLimit.toLocaleString()}</span>
            <span className="text-amber-300 font-medium">{Math.round((overdraftUsed / (overdraftLimit || 1)) * 100)}% used</span>
          </div>
        </div>

        {/* 3. Receivables & Delinquency */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Unpaid Invoices</span>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100 mt-2">
            {currency} {totalAR.toLocaleString()}
          </div>
          <div className="mt-3 text-xs text-rose-400 flex items-center gap-1 font-semibold">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{currency} {overdue60.toLocaleString()} &gt;60 days overdue</span>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            {totalAR > 0 ? Math.round((overdue60 / totalAR) * 100) : 0}% of receivables delinquent
          </div>
        </div>

        {/* 4. Trapped Overdraft Interest */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Est. Annual Interest Burn</span>
            <Coins className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-2xl font-bold text-orange-400 mt-2">
            {currency} {Math.round(annualInterestCurrent).toLocaleString()}<span className="text-xs font-normal text-slate-400">/yr</span>
          </div>
          <div className="mt-3 text-xs text-slate-400">
            Based on ~{overdraftRatePercent}% commercial rate on {currency} {overdraftUsed.toLocaleString()} balance
          </div>
          <div className="mt-2 text-xs text-amber-300">
            Paying interest to fund customer delays
          </div>
        </div>
      </div>

      {/* Interactive Working Capital & Debt Recovery Simulator */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-bold text-slate-100">
                Interactive Debt Recovery & Cash Infusion Simulator
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Simulate the mathematical impact of recovering the {currency} {overdue60.toLocaleString()} in overdue invoices (&gt;60 days) and shifting to 100% upfront supplies billing.
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700/80">
            <span className="text-xs font-medium text-slate-300">100% Upfront Supplies/Hardware Policy:</span>
            <button
              onClick={() => setHardwarePolicyEnforced(!hardwarePolicyEnforced)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                hardwarePolicyEnforced
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
              }`}
            >
              {hardwarePolicyEnforced ? 'ENFORCED' : 'OFF'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-6">
          {/* Recovery Slider Controls */}
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-slate-200">
                  Target Recovery Rate for &gt;60-Day Debt
                </label>
                <span className="text-base font-bold text-amber-400 font-mono">
                  {recoveredPercent}% ({currency} {recoveredAmount.toLocaleString()})
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={recoveredPercent}
                onChange={(e) => setRecoveredPercent(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1 font-mono">
                <span>0% (NZ$0)</span>
                <span>50%</span>
                <span>65% (Recommended)</span>
                <span>100%</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-slate-200">
                  Monthly Supplies / Hardware Procurement Volume
                </label>
                <span className="text-sm font-bold text-slate-300 font-mono">
                  {currency} {monthlyHardwareVolume.toLocaleString()} / mo
                </span>
              </div>
              <input
                type="range"
                min="5000"
                max="60000"
                step="2500"
                value={monthlyHardwareVolume}
                onChange={(e) => setMonthlyHardwareVolume(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <p className="text-xs text-slate-400 mt-1">
                Requiring 100% upfront payment stops your company from acting as an interest-free bank for client hardware.
              </p>
            </div>
          </div>

          {/* Simulated Financial Outcome Matrix */}
          <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center justify-between">
              <span>Simulated Solvency Outcome</span>
              <span className="font-mono text-emerald-400 text-sm">+{currency} {recoveredAmount.toLocaleString()} Inflow</span>
            </h4>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Simulated Overdraft Balance</span>
                <span className={`text-lg font-bold font-mono mt-0.5 block ${
                  simulatedOverdraftUsed === 0 ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  {currency} {simulatedOverdraftUsed.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-500">
                  down from {currency} {overdraftUsed.toLocaleString()}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Uncapped Bank Headroom</span>
                <span className="text-lg font-bold font-mono text-emerald-400 mt-0.5 block">
                  {currency} {simulatedHeadroom.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-500">
                  total emergency buffer
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Annual Interest Eliminated</span>
                <span className="text-lg font-bold font-mono text-emerald-400 mt-0.5 block">
                  +{currency} {Math.round(annualInterestSaved).toLocaleString()} / yr
                </span>
                <span className="text-[10px] text-slate-500">
                  saved from bank financing fees
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Supplies Float Protected</span>
                <span className="text-lg font-bold font-mono text-emerald-400 mt-0.5 block">
                  +{currency} {hardwareFloatUnlocked.toLocaleString()} / mo
                </span>
                <span className="text-[10px] text-slate-500">
                  float preserved upfront
                </span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs flex items-center justify-between">
              <span className="text-slate-300">Simulated Net Immediate Cash Position:</span>
              <span className={`font-mono font-bold text-sm ${simulatedNetLiquidity >= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {simulatedNetLiquidity < 0 ? '-' : '+'}{currency} {Math.abs(simulatedNetLiquidity).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

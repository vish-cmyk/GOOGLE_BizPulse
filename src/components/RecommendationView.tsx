import React, { useState } from 'react';
import { 
  Sparkles, 
  RefreshCw, 
  AlertOctagon, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  ArrowRight, 
  ShieldCheck, 
  FileText, 
  Scale, 
  Clock, 
  MessageSquare
} from 'lucide-react';
import { 
  BusinessProfile, 
  HealthDimensionKey, 
  HealthDimensionInput, 
  OverallHealthAssessment, 
  FinancialData, 
  RecommendationOutput 
} from '../types/bizpulse';

interface RecommendationViewProps {
  profile: BusinessProfile;
  healthInputs: Record<HealthDimensionKey, HealthDimensionInput>;
  financials: FinancialData | null;
  overallHealth: OverallHealthAssessment | null;
  recommendations: RecommendationOutput | null;
  onUpdateRecommendations: (rec: RecommendationOutput) => void;
  onNavigateToConsole: (initialPrompt?: string) => void;
}

export const RecommendationView: React.FC<RecommendationViewProps> = ({
  profile,
  healthInputs,
  financials,
  overallHealth,
  recommendations,
  onUpdateRecommendations,
  onNavigateToConsole,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateRecommendation = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/coach/generate-recommendation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessProfile: profile,
          healthInputs,
          financials,
          overallHealth,
        }),
      });

      if (!response.ok) {
        throw new Error('Server returned an error generating recommendation.');
      }

      const data = await response.json();
      if (data.recommendation) {
        onUpdateRecommendations(data.recommendation);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error communicating with Gemini recommendation engine.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner Context */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-500/20 text-orange-300 border border-orange-500/30 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                Phase 3: Turnaround Diagnostic Engine
              </span>
              <span className="text-slate-400 text-xs">Dynamic Commercial Advisory</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Executive Recommendations
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Grounded strictly in your business profile ({profile.industry}, {profile.country}) and 8 health inputs. Identifies the primary commercial issue, immediate actions, and key evidence gaps without lengthy questionnaires.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleGenerateRecommendation}
              disabled={isLoading}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 text-slate-950 font-bold text-xs shadow-lg shadow-orange-500/20 transition transform active:scale-95"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Synthesizing...' : recommendations ? 'Regenerate Analysis' : 'Generate Recommendation'}</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-rose-950/60 border border-rose-800 text-rose-300 text-xs rounded-xl flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-slate-400 hover:text-white">✕</button>
          </div>
        )}
      </div>

      {/* Main Recommendation Content */}
      {recommendations ? (
        <div className="space-y-6">
          {/* 1 & 2: Initial Observation & Commercial Why */}
          <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex items-center space-x-2">
              <span className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">
                1
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Primary Commercial Observation
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug">
              {recommendations.initialObservation}
            </h3>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1.5 leading-relaxed">
              <strong className="text-amber-300 uppercase tracking-wider text-[11px] block">
                Why This Matters Commercially (Profit, Solvency & Capacity):
              </strong>
              <p>{recommendations.commercialWhy}</p>
            </div>
          </div>

          {/* 3: Knowns vs Assumptions vs Unknowns */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-4">
            <div className="flex items-center space-x-2">
              <span className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-300 font-bold text-xs flex items-center justify-center">
                2
              </span>
              <h4 className="font-bold text-white text-base">
                Evidence Audit: Knowns vs. Assumptions vs. Unknowns
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {/* Known Information */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-emerald-900/40 space-y-2">
                <span className="font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Established Knowns
                </span>
                <ul className="space-y-1 text-slate-300">
                  {recommendations.knownsVsAssumptions.knowns.map((k, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-500 font-bold">•</span>
                      <span>{k}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Working Assumptions */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-amber-900/40 space-y-2">
                <span className="font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Working Assumptions
                </span>
                <ul className="space-y-1 text-slate-300">
                  {recommendations.knownsVsAssumptions.assumptions.map((a, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-amber-500 font-bold">?</span>
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Critical Unknowns */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <span className="font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5" />
                  Missing Unknowns
                </span>
                <ul className="space-y-1 text-slate-300">
                  {recommendations.knownsVsAssumptions.unknowns.map((u, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-slate-500 font-bold">!</span>
                      <span>{u}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* 4 & 5: Contextual Questions & Missing Evidence */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contextual Questions */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-purple-400" />
                The 2–3 Essential Questions for the Next Decision
              </span>
              <p className="text-xs text-slate-400">
                To prevent questionnaire fatigue, answer only these few questions to finalize your action plan:
              </p>
              <div className="space-y-2 pt-1 text-xs">
                {recommendations.contextualQuestions.map((q, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 font-medium">
                    <span className="text-purple-400 font-bold mr-1.5">{idx + 1}.</span>
                    {q}
                  </div>
                ))}
              </div>
            </div>

            {/* Critical Missing Evidence */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-blue-400" />
                Critical Evidence Required Before Major Outlays
              </span>
              <p className="text-xs text-slate-400">
                Data sources that will materially confirm or alter strategic direction:
              </p>
              <ul className="space-y-2 pt-1 text-xs text-slate-300">
                {recommendations.missingEvidence.map((ev, idx) => (
                  <li key={idx} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-start gap-2">
                    <span className="text-blue-400 font-bold">→</span>
                    <span>{ev}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 6, 7 & 8: Actionable Recommendations & Immediate Action */}
          <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-6 sm:p-8 shadow-xl space-y-5">
            <div className="flex items-center space-x-2">
              <span className="w-7 h-7 rounded-lg bg-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center">
                3
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Strategic Action Plan & Immediate 48-Hour Step
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-emerald-800/40 space-y-2">
              <span className="font-bold text-white text-sm block">Core Turnaround Recommendation:</span>
              <p className="text-xs text-slate-200 leading-relaxed">
                {recommendations.initialRecommendation}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 to-slate-950 border border-emerald-800/40 space-y-1.5">
              <span className="font-bold text-emerald-400 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                Immediate Action (Next 48–72 Hours):
              </span>
              <p className="text-xs text-emerald-200 leading-relaxed font-medium">
                {recommendations.immediateAction}
              </p>
            </div>

            {/* Specialist Advice Callout */}
            {recommendations.specialistAdviceNeeded && (
              <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-900/30 text-xs text-amber-200/90 flex items-start gap-2">
                <Scale className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-300">Specialist Advisory Trigger: </strong>
                  {recommendations.specialistAdviceNeeded}
                </div>
              </div>
            )}

            <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
              <span className="text-[11px] text-slate-500 font-mono">
                Generated {new Date(recommendations.generatedAt).toLocaleString()}
              </span>

              <button
                onClick={() => onNavigateToConsole(`Regarding the recommendation: "${recommendations.initialRecommendation.substring(0, 80)}..." How do I execute this step?`)}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
              >
                <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                <span>Discuss with Coach in Console</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">
            Ready to Generate Custom Turnaround Recommendations
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            BizPulse will analyze your {profile.name} profile ({profile.industry}) and your 8 health inputs to deliver an actionable, evidence-based turnaround diagnostic.
          </p>
          <button
            onClick={handleGenerateRecommendation}
            disabled={isLoading}
            className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 text-slate-950 text-xs font-bold shadow-lg shadow-orange-500/20 transition"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isLoading ? 'Analyzing Business...' : 'Generate AI Diagnostic Now'}</span>
          </button>
        </div>
      )}
    </div>
  );
};

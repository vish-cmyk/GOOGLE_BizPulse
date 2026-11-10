import React, { useState } from 'react';
import { 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  AlertOctagon, 
  HelpCircle, 
  Clock, 
  RefreshCw, 
  ShieldAlert, 
  ArrowRight,
  ChevronDown,
  ChevronUp,
  FileText,
  BarChart3,
  Layers,
  Sparkles
} from 'lucide-react';
import { 
  HealthDimensionKey, 
  HealthDimensionInput, 
  HealthStatus, 
  OverallHealthAssessment, 
  BusinessProfile 
} from '../types/bizpulse';

interface BusinessHealthViewProps {
  profile: BusinessProfile;
  healthInputs: Record<HealthDimensionKey, HealthDimensionInput>;
  overallHealth: OverallHealthAssessment | null;
  onUpdateInput: (key: HealthDimensionKey, updated: HealthDimensionInput) => void;
  onRecalculateOverall: () => void;
  onProceedToRecommendations: () => void;
}

const DIMENSION_ORDER: HealthDimensionKey[] = [
  'direction',
  'customers',
  'sales',
  'money',
  'operations',
  'people',
  'ownerDependency',
  'technology',
];

export const BusinessHealthView: React.FC<BusinessHealthViewProps> = ({
  profile,
  healthInputs,
  overallHealth,
  onUpdateInput,
  onRecalculateOverall,
  onProceedToRecommendations,
}) => {
  const [expandedDimension, setExpandedDimension] = useState<HealthDimensionKey | null>('money');

  const handleStatusChange = (key: HealthDimensionKey, status: HealthStatus) => {
    const current = healthInputs[key];
    onUpdateInput(key, { ...current, status });
  };

  const handleNotesChange = (key: HealthDimensionKey, notes: string) => {
    const current = healthInputs[key];
    onUpdateInput(key, { ...current, notes });
  };

  const getStatusColor = (status: HealthStatus) => {
    switch (status) {
      case 'healthy':
        return {
          bg: 'bg-emerald-500/15',
          border: 'border-emerald-500/30',
          text: 'text-emerald-300',
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
          label: 'Healthy',
          icon: CheckCircle2,
        };
      case 'needs_attention':
        return {
          bg: 'bg-amber-500/15',
          border: 'border-amber-500/30',
          text: 'text-amber-300',
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
          label: 'Needs Attention',
          icon: AlertTriangle,
        };
      case 'at_risk':
        return {
          bg: 'bg-rose-500/15',
          border: 'border-rose-500/30',
          text: 'text-rose-300',
          badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
          label: 'At Risk',
          icon: AlertOctagon,
        };
      case 'not_sure':
        return {
          bg: 'bg-blue-500/15',
          border: 'border-blue-500/30',
          text: 'text-blue-300',
          badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
          label: 'Not Sure / No Data',
          icon: HelpCircle,
        };
      case 'unanswered':
      default:
        return {
          bg: 'bg-slate-800/40',
          border: 'border-slate-700/60',
          text: 'text-slate-400',
          badge: 'bg-slate-800 text-slate-400 border-slate-700',
          label: 'Unanswered',
          icon: Clock,
        };
    }
  };

  // Radar / Spider Chart SVG generator for 8 dimensions
  const renderRadarChart = () => {
    const size = 260;
    const center = size / 2;
    const radius = 95;
    const count = DIMENSION_ORDER.length;

    // Angle step
    const angleStep = (Math.PI * 2) / count;

    // Calculate score for each dimension (Healthy=100, Attention=50, AtRisk=20, NotSure=35, Unanswered=0)
    const points = DIMENSION_ORDER.map((key, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const status = healthInputs[key]?.status || 'unanswered';
      let factor = 0;
      if (status === 'healthy') factor = 1.0;
      else if (status === 'needs_attention') factor = 0.55;
      else if (status === 'not_sure') factor = 0.35;
      else if (status === 'at_risk') factor = 0.2;
      else factor = 0.08;

      const r = radius * factor;
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      return { x, y, key, status };
    });

    const polygonPoints = points.map(p => `${p.x},${p.y}`).join(' ');

    return (
      <div className="flex flex-col items-center justify-center p-2">
        <svg width={size} height={size} className="overflow-visible">
          {/* Background Concentric Circles */}
          {[0.25, 0.5, 0.75, 1.0].map((level) => (
            <circle
              key={level}
              cx={center}
              cy={center}
              r={radius * level}
              fill="none"
              stroke="#334155"
              strokeDasharray={level < 1 ? '2 3' : 'none'}
              strokeWidth="1"
            />
          ))}

          {/* Spokes */}
          {DIMENSION_ORDER.map((_, i) => {
            const angle = i * angleStep - Math.PI / 2;
            const x2 = center + radius * Math.cos(angle);
            const y2 = center + radius * Math.sin(angle);
            return (
              <line
                key={i}
                x1={center}
                y1={center}
                x2={x2}
                y2={y2}
                stroke="#1e293b"
                strokeWidth="1.5"
              />
            );
          })}

          {/* Polygon Area */}
          <polygon
            points={polygonPoints}
            fill="rgba(245, 158, 11, 0.25)"
            stroke="#f59e0b"
            strokeWidth="2"
          />

          {/* Dots & Labels */}
          {points.map((p, i) => {
            const angle = i * angleStep - Math.PI / 2;
            const labelDist = radius + 22;
            const lx = center + labelDist * Math.cos(angle);
            const ly = center + labelDist * Math.sin(angle);
            const statusConfig = getStatusColor(p.status);

            return (
              <g key={p.key}>
                <circle cx={p.x} cy={p.y} r="4" fill="#fbbf24" stroke="#0f172a" strokeWidth="1.5" />
                <text
                  x={lx}
                  y={ly + 3}
                  textAnchor="middle"
                  className="text-[9px] font-bold uppercase fill-slate-300 font-mono tracking-tighter"
                >
                  {p.key.substring(0, 4)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  const answeredCount = DIMENSION_ORDER.filter(k => healthInputs[k]?.status !== 'unanswered').length;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Top Banner Context */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Phase 2: Substantive Diagnosis
              </span>
              <span className="text-slate-400 text-xs">8 Dimensions + 9th Graphical Summary</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Business Health Assessment
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Rate each of the 8 commercial dimensions based on your current business realities. This forms the factual baseline for your turnaround strategy.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onRecalculateOverall}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
              title="Recalculate overall score based on current inputs"
            >
              <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
              <span>Update Score</span>
            </button>
            <button
              onClick={onProceedToRecommendations}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 text-xs font-bold shadow-md shadow-orange-500/20 transition"
            >
              <span>View Recommendations</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Completion Progress Bar */}
        <div className="mt-6 pt-5 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Input Completion: <strong className="text-white">{answeredCount} of 8 Dimensions Answered</strong></span>
          <div className="w-48 bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
            <div 
              className="bg-amber-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${(answeredCount / 8) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* =========================================================================
          NINTH OUTPUT: OVERALL BUSINESS HEALTH GRAPHICAL SUMMARY
         ========================================================================= */}
      {overallHealth && (
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-amber-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-amber-400" />
                The Ninth Output: Overall Business Health
              </span>
              <h3 className="text-2xl font-extrabold text-white">
                {overallHealth.scoreLabel}
              </h3>
              <p className="text-xs text-slate-400 max-w-xl">
                Assessment Date: <strong className="text-slate-200">{overallHealth.assessmentDate}</strong> • 
                Status: <span className="text-amber-300 font-semibold">{overallHealth.overallRating}</span> • 
                {overallHealth.isProvisional ? ' (Provisional: Incomplete inputs or unverified debtor data)' : ' (Confirmed)'}
              </p>
            </div>

            {/* Score Badge */}
            <div className="flex items-center space-x-6">
              <div className="text-center bg-slate-950 px-6 py-4 rounded-2xl border border-slate-800 shadow-lg min-w-[140px]">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold block">Overall Score</span>
                <div className={`text-4xl font-black mt-1 font-mono ${
                  overallHealth.overallScore >= 70 ? 'text-emerald-400' :
                  overallHealth.overallScore >= 45 ? 'text-amber-400' : 'text-rose-400'
                }`}>
                  {overallHealth.overallScore}
                  <span className="text-xs font-normal text-slate-500"> /100</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mt-1.5 inline-block ${
                  overallHealth.overallRating === 'Healthy' ? 'bg-emerald-500/20 text-emerald-300' :
                  overallHealth.overallRating === 'Needs Attention' ? 'bg-amber-500/20 text-amber-300' : 'bg-rose-500/20 text-rose-300'
                }`}>
                  {overallHealth.overallRating}
                </span>
              </div>
            </div>
          </div>

          {/* Visual Radar & Diagnostic Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            {/* Visual Radar Graphic */}
            <div className="bg-slate-950/80 rounded-2xl border border-slate-800 p-4 flex flex-col items-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                8-Dimension Balance Map
              </span>
              {renderRadarChart()}
              <div className="flex flex-wrap items-center justify-center gap-2 mt-2 text-[10px] text-slate-400">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400"></span> Healthy</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400"></span> Needs Attention</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-400"></span> At Risk</span>
              </div>
            </div>

            {/* Diagnostic Breakdown */}
            <div className="lg:col-span-2 space-y-4 text-xs">
              {/* Critical Risks */}
              <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-900/40 space-y-1.5">
                <span className="font-bold text-rose-400 uppercase tracking-wider block flex items-center gap-1.5">
                  <AlertOctagon className="w-3.5 h-3.5" />
                  Most Urgent Vulnerabilities / Bottlenecks:
                </span>
                <ul className="space-y-1 text-slate-200">
                  {overallHealth.criticalRisksIdentified.map((risk, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-rose-400 font-bold">•</span>
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Strongest Areas & Missing Evidence */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-900/30 space-y-1">
                  <span className="font-bold text-emerald-400 uppercase tracking-wider block">
                    Core Operational Strengths:
                  </span>
                  <ul className="space-y-1 text-slate-300">
                    {overallHealth.strongestAreas.map((area, i) => (
                      <li key={i}>• {area}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 rounded-xl bg-blue-950/20 border border-blue-900/30 space-y-1">
                  <span className="font-bold text-blue-400 uppercase tracking-wider block">
                    Information Gaps / Missing Data:
                  </span>
                  <ul className="space-y-1 text-slate-300">
                    {overallHealth.missingEvidenceAreas.map((gap, i) => (
                      <li key={i}>• {gap}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Scoring Rules Explanation */}
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
                <strong className="text-slate-300">Weighting & Override Discipline: </strong>
                {overallHealth.scoringWeightRules}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          THE EIGHT HEALTH DIMENSIONS INPUT ACCORDION / LIST
         ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-400" />
            <span>The Eight Health Dimensions (Owner-Reported Inputs)</span>
          </h3>
          <span className="text-xs text-slate-400">Click a dimension to update status and notes</span>
        </div>

        {DIMENSION_ORDER.map((key, index) => {
          const item = healthInputs[key];
          const statusConfig = getStatusColor(item.status);
          const isExpanded = expandedDimension === key;
          const Icon = statusConfig.icon;

          return (
            <div
              key={key}
              className={`rounded-2xl border transition-all ${
                isExpanded ? 'bg-slate-900 border-slate-700 shadow-xl' : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Header Bar */}
              <div
                onClick={() => setExpandedDimension(isExpanded ? null : key)}
                className="p-5 flex items-center justify-between cursor-pointer select-none"
              >
                <div className="flex items-center space-x-3.5">
                  <span className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 font-bold text-xs flex items-center justify-center border border-slate-700">
                    {index + 1}
                  </span>
                  <div>
                    <h4 className="font-bold text-white text-sm">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-1">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${statusConfig.badge}`}>
                    <Icon className="w-3.5 h-3.5" />
                    <span>{statusConfig.label}</span>
                  </span>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </div>
              </div>

              {/* Expanded Edit Form */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-slate-800/80 space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-2">
                      Select Health Status for this Dimension:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {(['healthy', 'needs_attention', 'at_risk', 'not_sure'] as HealthStatus[]).map((st) => {
                        const cfg = getStatusColor(st);
                        const isSelected = item.status === st;
                        const StIcon = cfg.icon;

                        return (
                          <button
                            key={st}
                            type="button"
                            onClick={() => {
                              handleStatusChange(key, st);
                              onRecalculateOverall();
                            }}
                            className={`p-3 rounded-xl border text-left flex items-center space-x-2 transition ${
                              isSelected
                                ? `${cfg.bg} ${cfg.border} ring-1 ring-amber-500/50 text-white font-bold`
                                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                            }`}
                          >
                            <StIcon className={`w-4 h-4 ${isSelected ? cfg.text : 'text-slate-500'}`} />
                            <span className="text-xs">{cfg.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Written Explanation Note */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                      <span>Owner's Context & Specific Operational Evidence:</span>
                      <span className="text-[11px] text-slate-500">Optional but strongly recommended</span>
                    </label>
                    <textarea
                      rows={2}
                      value={item.notes}
                      onChange={(e) => handleNotesChange(key, e.target.value)}
                      placeholder={`Describe what is happening in ${item.title.toLowerCase()}...`}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

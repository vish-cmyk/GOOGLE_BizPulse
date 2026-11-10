import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Save, 
  CheckCircle2, 
  HelpCircle, 
  Globe, 
  Users, 
  Coins, 
  Calendar, 
  Target, 
  AlertTriangle,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { BusinessProfile, IndustryType, BusinessStructureType } from '../types/bizpulse';

interface BusinessEssentialsViewProps {
  profile: BusinessProfile;
  onUpdateProfile: (updated: BusinessProfile) => void;
  onProceedToHealth: () => void;
}

const INDUSTRIES: IndustryType[] = [
  'Trades / Contracting',
  'Retail / E-commerce',
  'Professional Services',
  'Hospitality & Food',
  'IT & Managed Services',
  'Manufacturing & Engineering',
  'Healthcare & Wellness',
  'Transport & Logistics',
  'Other',
];

const BUSINESS_STRUCTURES: BusinessStructureType[] = [
  'Owner-operated',
  'Family business',
  'Partnership',
  'Company with management team',
];

const CURRENCIES = [
  { code: 'NZD', symbol: 'NZ$', label: 'New Zealand Dollar (NZD)' },
  { code: 'AUD', symbol: 'A$', label: 'Australian Dollar (AUD)' },
  { code: 'USD', symbol: '$', label: 'US Dollar (USD)' },
  { code: 'GBP', symbol: '£', label: 'British Pound (GBP)' },
  { code: 'EUR', symbol: '€', label: 'Euro (EUR)' },
  { code: 'CAD', symbol: 'CA$', label: 'Canadian Dollar (CAD)' },
];

export const BusinessEssentialsView: React.FC<BusinessEssentialsViewProps> = ({
  profile,
  onUpdateProfile,
  onProceedToHealth,
}) => {
  const [formData, setFormData] = useState<BusinessProfile>(profile);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setFormData(profile);
  }, [profile]);

  const handleChange = (field: keyof BusinessProfile, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsSaved(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Phase 1: Foundation
              </span>
              <span className="text-slate-400 text-xs">Onboarding & Context Isolation</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Business Essentials
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Every SME has unique customer dynamics, cost drivers, and operational bottlenecks. Enter your actual business profile to ensure all AI coaching and diagnostics reflect your commercial reality.
            </p>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 min-w-[200px] text-center shadow-lg">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Active Case ID</span>
            <div className="text-xs font-mono font-bold text-amber-400 mt-1 truncate max-w-[180px]">
              {formData.caseId}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {formData.isDemonstrationCase ? 'Pre-filled Demo MSP' : 'Custom Business Assessment'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Profile Form */}
      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Business Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-200 flex items-center justify-between">
              <span>Business / Trading Name *</span>
              <span className="text-[11px] text-slate-500 font-normal">Legal or Trading</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="e.g., Apex Electrical Contracting, Horizon Cafe..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Industry Type */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-200">
              Industry & Sector *
            </label>
            <select
              value={formData.industry}
              onChange={(e) => handleChange('industry', e.target.value as IndustryType)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {INDUSTRIES.map((ind) => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>
          </div>

          {/* Business Structure */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-200">
              Business Structure *
            </label>
            <select
              value={formData.businessType}
              onChange={(e) => handleChange('businessType', e.target.value as BusinessStructureType)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {BUSINESS_STRUCTURES.map((struct) => (
                <option key={struct} value={struct}>{struct}</option>
              ))}
            </select>
          </div>

          {/* Country & Currency */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-200">
                Country *
              </label>
              <input
                type="text"
                required
                value={formData.country}
                onChange={(e) => handleChange('country', e.target.value)}
                placeholder="New Zealand, Australia..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-200">
                Currency *
              </label>
              <select
                value={formData.currency}
                onChange={(e) => handleChange('currency', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>{c.code} ({c.symbol})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Years Operating & Workforce */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-200">
                Years Operating
              </label>
              <input
                type="number"
                min="0"
                value={formData.yearsOperating}
                onChange={(e) => handleChange('yearsOperating', Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-200">
                Employees
              </label>
              <input
                type="number"
                min="0"
                value={formData.employeeCount}
                onChange={(e) => handleChange('employeeCount', Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-200">
                Subcontractors
              </label>
              <input
                type="number"
                min="0"
                value={formData.subcontractorCount}
                onChange={(e) => handleChange('subcontractorCount', Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Main Customer Types */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-200">
              Main Customer Types *
            </label>
            <input
              type="text"
              required
              value={formData.mainCustomerTypes}
              onChange={(e) => handleChange('mainCustomerTypes', e.target.value)}
              placeholder="e.g. Local builders, residential homeowners, B2B corporate clients..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Main Products / Services */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-200">
            Main Products or Services Provided *
          </label>
          <textarea
            rows={2}
            required
            value={formData.mainProductsServices}
            onChange={(e) => handleChange('mainProductsServices', e.target.value)}
            placeholder="Describe what your business sells, delivers, or installs..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Owner's Primary Objective */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-emerald-400" />
            <span>Owner's Primary Objective (Next 6–12 Months) *</span>
          </label>
          <input
            type="text"
            required
            value={formData.primaryObjective}
            onChange={(e) => handleChange('primaryObjective', e.target.value)}
            placeholder="e.g. Stabilize cash flow, reduce owner working hours, improve net profit margin..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* The Most Important Concern */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>The Single Most Important Concern or Pressure Facing the Business *</span>
          </label>
          <textarea
            rows={3}
            required
            value={formData.primaryConcern}
            onChange={(e) => handleChange('primaryConcern', e.target.value)}
            placeholder="What is keeping you awake at night? (e.g. Overdue debtors, rising costs, finding good technicians, thin margins, owner burnout...)"
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Form Actions */}
        <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Case data is isolated and saved locally in your browser.</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition"
            >
              <Save className="w-4 h-4" />
              <span>{isSaved ? 'Saved!' : 'Save Essentials'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onUpdateProfile(formData);
                onProceedToHealth();
              }}
              className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 text-xs font-bold shadow-lg shadow-orange-500/20 transition transform active:scale-95"
            >
              <span>Proceed to Health Assessment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

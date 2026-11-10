export type IndustryType = 
  | 'Trades / Contracting'
  | 'Retail / E-commerce'
  | 'Professional Services'
  | 'Hospitality & Food'
  | 'IT & Managed Services'
  | 'Manufacturing & Engineering'
  | 'Healthcare & Wellness'
  | 'Transport & Logistics'
  | 'Other';

export type BusinessStructureType = 
  | 'Owner-operated'
  | 'Family business'
  | 'Partnership'
  | 'Company with management team';

export interface BusinessProfile {
  caseId: string;
  name: string;
  industry: IndustryType;
  businessType: BusinessStructureType;
  country: string;
  currency: string;
  yearsOperating: number | string;
  employeeCount: number;
  subcontractorCount: number;
  mainProductsServices: string;
  mainCustomerTypes: string;
  primaryObjective: string;
  primaryConcern: string;
  isDemonstrationCase: boolean;
  createdAt: string;
  updatedAt: string;
}

export type HealthDimensionKey = 
  | 'direction'
  | 'customers'
  | 'sales'
  | 'money'
  | 'operations'
  | 'people'
  | 'ownerDependency'
  | 'technology';

export type HealthStatus = 'healthy' | 'needs_attention' | 'at_risk' | 'not_sure' | 'unanswered';

export interface HealthDimensionInput {
  key: HealthDimensionKey;
  title: string;
  description: string;
  status: HealthStatus;
  notes: string;
  evidenceType: 'owner_reported' | 'verified' | 'assumption' | 'hypothesis' | 'unknown';
}

export interface OverallHealthAssessment {
  overallScore: number; // 0 to 100
  overallRating: 'Healthy' | 'Needs Attention' | 'At Risk' | 'Incomplete / Missing Information';
  scoreLabel: string;
  criticalRisksIdentified: string[];
  strongestAreas: string[];
  missingEvidenceAreas: string[];
  mainDrivers: string[];
  assessmentDate: string;
  scoringWeightRules: string;
  isProvisional: boolean;
}

export interface FinancialData {
  annualRevenue: number | null;
  directCosts: number | null;
  operatingExpenses: number | null;
  operatingProfit: number | null;
  cashInBank: number | null;
  accountsReceivable: number | null;
  overdueReceivables: number | null;
  accountsPayable: number | null;
  creditFacilityLimit: number | null;
  creditFacilityUsed: number | null;
  customerCount: number | null;
  top5ConcentrationPercent: number | null;
  top12ConcentrationPercent: number | null;
  standardPaymentTermsDays: number;
  actualPaymentDelayDays: number | null;
  pricingReviewLastYears: number | null;
}

export interface RecommendationOutput {
  initialObservation: string;
  commercialWhy: string;
  knownsVsAssumptions: {
    knowns: string[];
    assumptions: string[];
    unknowns: string[];
  };
  missingEvidence: string[];
  contextualQuestions: string[];
  initialRecommendation: string;
  immediateAction: string;
  specialistAdviceNeeded: string | null;
  generatedAt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'coach';
  text: string;
  timestamp: string;
  metadata?: {
    topic?: string;
    role?: string;
  };
}

export interface TurnaroundAction {
  id: string;
  horizon: 'Horizon 1 (First 7 Days)' | 'Horizon 2 (Days 8–30)' | 'Horizon 3 (Days 31–90)';
  priority: 'Priority 1 (Urgent)' | 'Priority 2 (High)' | 'Priority 3 (Medium)';
  businessIssue?: string;
  action: string;
  accountableRole: string;
  timeframe: string;
  requiredInformationOrResources: string[];
  measurableSuccessIndicator: string;
  dependencyOrRisk: string;
  status?: 'pending' | 'in_progress' | 'completed';
  completed?: boolean;
}

export interface ReportedFinancials {
  revenue: number;
  directCosts: number;
  operatingExpenses: number;
  reportedOperatingProfit: number;
  accountsReceivable: number;
  overdue60Days: number;
  reportedPaymentDelayDays: string;
  supplierPayables: number;
  cashInBank: number;
  overdraftLimit: number;
  overdraftUsed: number;
  activeCustomers: number;
  top5RevenueConcentration: number;
  top12RecurringConcentration: number;
  staffCount?: number;
  subcontractorCount?: number;
  subcontractors?: number;
  customerLoss12Months?: number;
  pricingFrozenYears?: number;
  estimatedCostInflationPct?: number;
}

export interface CustomDashboardMetric {
  id: string;
  name: string;
  area: string;
  currentValue: string;
  targetBenchmark: string;
  warningThreshold: string;
  criticalThreshold: string;
  accountableRole: string;
  frequency: string;
  explanation: string;
  isSupplied: boolean;
}

export type PaymentStatus = 'free' | 'pending' | 'paid' | 'failed' | 'refunded';

export interface PaymentRecord {
  sessionId: string;
  caseId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  tier: 'Diagnostic Report & Turnaround OS' | 'Executive Subscription';
  unlockedAt?: string;
  receiptUrl?: string;
  paymentMethod?: string;
}

export interface CaseRecord {
  id: string;
  profile: BusinessProfile;
  healthInputs: Record<HealthDimensionKey, HealthDimensionInput>;
  overallHealth: OverallHealthAssessment | null;
  financials: FinancialData | null;
  recommendations: RecommendationOutput | null;
  conversations: ChatMessage[];
  actionPlan: TurnaroundAction[];
  dashboardMetrics: CustomDashboardMetric[];
  paymentStatus?: PaymentStatus;
  paymentRecord?: PaymentRecord | null;
  isUnlocked?: boolean;
  updatedAt: string;
}

export interface ScriptPreset {
  id: string;
  title: string;
  description: string;
  category: 'Cash Collection' | 'Contract & Pricing' | 'Service Boundaries' | 'Client Retention';
  defaultPrompt: string;
}

export interface GrowthOptionAnalysis {
  id: 'Option A' | 'Option B' | 'Option C';
  title: string;
  proposedAction: string;
  upfrontCashRequirement: string;
  likelyOngoingCommitments: string;
  whatMustBeTrue: string[];
  commercialAssumptionsToTest: string[];
  routeToRevenueAndCash: string;
  principalRisks: string[];
  evidenceRequiredBeforeCommitment: string[];
  approvalConditions: string[];
  deferralConditions: string[];
  rejectionConditions: string[];
  calculationFramework: {
    formula: string;
    requiredInputs: string[];
    explanation: string;
  };
}

export interface RiskMapItem {
  id: string;
  category: string;
  reportedSymptom: string;
  possibleUnderlyingCause: string;
  evidenceCurrentlyAvailable: string[];
  evidenceStillRequired: string[];
  potentialCommercialConsequence: string;
  urgency: 'Immediate (Within 7 Days)' | 'High (Within 30 Days)' | 'Medium (Within 90 Days)';
  recommendedFirstAction: string;
  hypothesisToTest: string;
  confirmationCriteria: string;
  disproofCriteria: string;
}

export interface MissingInformationItem {
  priority: 'Immediate (Next 48–72 Hours)' | 'Secondary (Within 14–30 Days)';
  category: string;
  item: string;
  decisionItEnables: string;
  sourceOrMethod: string;
  ownerQuestion: string;
}

export interface WeeklyDashboardKPI {
  id: string;
  name: string;
  area: string;
  currentReportedValue: string;
  targetBenchmark: string;
  warningThreshold: string;
  criticalThreshold: string;
  accountableRole: string;
  measurementFrequency: string;
  explanation: string;
  criteriaExplanation: string;
}

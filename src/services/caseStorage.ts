import { 
  CaseRecord, 
  BusinessProfile, 
  HealthDimensionKey, 
  HealthDimensionInput, 
  OverallHealthAssessment, 
  FinancialData,
  IndustryType,
  BusinessStructureType
} from '../types/bizpulse';
import { DEMO_MSP_CASE, DEMO_CASE_ID, INITIAL_EMPTY_HEALTH_INPUTS } from '../data/demonstrationCase';

const STORAGE_KEY_CASES = 'bizpulse_cases_v2';
const STORAGE_KEY_ACTIVE_ID = 'bizpulse_active_case_id_v2';

export function createBlankHealthInputs(): Record<HealthDimensionKey, HealthDimensionInput> {
  const result: Record<string, HealthDimensionInput> = {};
  const keys = Object.keys(INITIAL_EMPTY_HEALTH_INPUTS) as HealthDimensionKey[];
  
  for (const key of keys) {
    result[key] = {
      key,
      title: INITIAL_EMPTY_HEALTH_INPUTS[key].title,
      description: INITIAL_EMPTY_HEALTH_INPUTS[key].description,
      status: 'unanswered',
      notes: '',
      evidenceType: 'unknown',
    };
  }
  return result as Record<HealthDimensionKey, HealthDimensionInput>;
}

export function createBlankCase(profileOverrides?: Partial<BusinessProfile>): CaseRecord {
  const caseId = 'case-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);
  const now = new Date().toISOString();

  const profile: BusinessProfile = {
    caseId,
    name: profileOverrides?.name || 'New Business Assessment',
    industry: profileOverrides?.industry || 'Trades / Contracting',
    businessType: profileOverrides?.businessType || 'Owner-operated',
    country: profileOverrides?.country || 'New Zealand',
    currency: profileOverrides?.currency || 'NZD',
    yearsOperating: profileOverrides?.yearsOperating || 3,
    employeeCount: profileOverrides?.employeeCount ?? 10,
    subcontractorCount: profileOverrides?.subcontractorCount ?? 0,
    mainProductsServices: profileOverrides?.mainProductsServices || '',
    mainCustomerTypes: profileOverrides?.mainCustomerTypes || '',
    primaryObjective: profileOverrides?.primaryObjective || 'Improve profitability and cash flow',
    primaryConcern: profileOverrides?.primaryConcern || '',
    isDemonstrationCase: false,
    createdAt: now,
    updatedAt: now,
  };

  const healthInputs = createBlankHealthInputs();

  const newCase: CaseRecord = {
    id: caseId,
    profile,
    healthInputs,
    overallHealth: null,
    financials: null,
    recommendations: null,
    conversations: [
      {
        id: 'msg-' + Date.now(),
        sender: 'coach',
        text: `Welcome to BizPulse. I am your commercial business coach. Please complete your Business Essentials and the 8 Health Dimensions to receive your personalized, evidence-based turnaround assessment.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ],
    actionPlan: [],
    dashboardMetrics: [],
    isUnlocked: false,
    paymentStatus: 'free',
    paymentRecord: null,
    updatedAt: now,
  };

  saveCase(newCase);
  setActiveCaseId(caseId);
  return newCase;
}

export function loadAllCases(): CaseRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CASES);
    if (!raw) {
      // First run: Seed the demonstration case into library
      const initial = [DEMO_MSP_CASE];
      localStorage.setItem(STORAGE_KEY_CASES, JSON.stringify(initial));
      return initial;
    }
    const parsed: CaseRecord[] = JSON.parse(raw);
    // Ensure Demo case is available in list
    if (!parsed.some(c => c.id === DEMO_CASE_ID)) {
      parsed.unshift(DEMO_MSP_CASE);
    }
    return parsed;
  } catch (err) {
    console.error('Error loading cases from localStorage:', err);
    return [DEMO_MSP_CASE];
  }
}

export function saveCase(caseRecord: CaseRecord): void {
  try {
    const all = loadAllCases();
    const index = all.findIndex(c => c.id === caseRecord.id);
    const updatedRecord = { ...caseRecord, updatedAt: new Date().toISOString() };
    
    if (index >= 0) {
      all[index] = updatedRecord;
    } else {
      all.push(updatedRecord);
    }
    localStorage.setItem(STORAGE_KEY_CASES, JSON.stringify(all));
  } catch (err) {
    console.error('Error saving case to localStorage:', err);
  }
}

export function getActiveCaseId(): string {
  return localStorage.getItem(STORAGE_KEY_ACTIVE_ID) || DEMO_CASE_ID;
}

export function setActiveCaseId(caseId: string): void {
  localStorage.setItem(STORAGE_KEY_ACTIVE_ID, caseId);
}

export function loadActiveCase(): CaseRecord {
  const all = loadAllCases();
  const activeId = getActiveCaseId();
  const found = all.find(c => c.id === activeId);
  if (found) return found;
  
  // Default to Demo case if not found
  const demo = all.find(c => c.id === DEMO_CASE_ID) || DEMO_MSP_CASE;
  setActiveCaseId(demo.id);
  return demo;
}

export function deleteCase(caseId: string): CaseRecord {
  if (caseId === DEMO_CASE_ID) {
    // Reset Demo case to original rather than deleting
    saveCase(DEMO_MSP_CASE);
    return DEMO_MSP_CASE;
  }

  const all = loadAllCases().filter(c => c.id !== caseId);
  localStorage.setItem(STORAGE_KEY_CASES, JSON.stringify(all));
  
  const nextCase = all[0] || DEMO_MSP_CASE;
  setActiveCaseId(nextCase.id);
  return nextCase;
}

/**
 * 8 Dimensions Scoring Algorithm (Ninth Output: Overall Business Health)
 * Rules:
 * - Healthy: 100 pts
 * - Needs Attention: 50 pts
 * - At Risk: 15 pts
 * - Not Sure: 35 pts (flags missing information)
 * - Unanswered: Excluded from score calculation
 * - Critical Risk Override: If Money or Operations is At Risk, overall rating cannot be 'Healthy' (capped at 'At Risk' or 'Needs Attention').
 * - Incomplete Override: If 3 or more dimensions are unanswered, status is 'Incomplete / Missing Information'.
 */
export function calculateOverallHealth(
  inputs: Record<HealthDimensionKey, HealthDimensionInput>,
  financials?: FinancialData | null
): OverallHealthAssessment {
  const keys = Object.keys(inputs) as HealthDimensionKey[];
  let totalScore = 0;
  let answeredCount = 0;
  let unansweredCount = 0;

  const criticalRisks: string[] = [];
  const strongestAreas: string[] = [];
  const missingEvidence: string[] = [];
  const mainDrivers: string[] = [];

  for (const key of keys) {
    const item = inputs[key];
    switch (item.status) {
      case 'healthy':
        totalScore += 100;
        answeredCount++;
        strongestAreas.push(`${item.title}: Sound processes and positive feedback.`);
        break;
      case 'needs_attention':
        totalScore += 50;
        answeredCount++;
        mainDrivers.push(`${item.title}: Requires active optimization and monitoring.`);
        break;
      case 'at_risk':
        totalScore += 15;
        answeredCount++;
        criticalRisks.push(`${item.title}: Urgent operational or financial friction flagged.`);
        mainDrivers.push(`${item.title}: Critical vulnerability requiring immediate intervention.`);
        break;
      case 'not_sure':
        totalScore += 35;
        answeredCount++;
        missingEvidence.push(`${item.title}: Owner reported lack of data or visibility.`);
        break;
      case 'unanswered':
      default:
        unansweredCount++;
        missingEvidence.push(`${item.title}: Unanswered dimension (no data provided).`);
        break;
    }
  }

  // Calculate raw average of answered dimensions
  const rawScore = answeredCount > 0 ? Math.round(totalScore / answeredCount) : 0;
  let finalScore = rawScore;

  // Financial constraint penalty
  if (financials) {
    if (financials.overdueReceivables && financials.overdueReceivables > 40000) {
      if (!criticalRisks.some(r => r.includes('Debtor'))) {
        criticalRisks.push(`Working capital pressure: Significant overdue receivables reported.`);
      }
    }
  }

  let rating: OverallHealthAssessment['overallRating'] = 'Healthy';
  let label = 'Operationally Resilient & Commercially Balanced';

  // Apply non-averaging risk overrides
  const moneyStatus = inputs.money?.status;
  const opsStatus = inputs.operations?.status;
  const hasCriticalSolvencyRisk = moneyStatus === 'at_risk';
  const hasCriticalOpsRisk = opsStatus === 'at_risk';

  if (unansweredCount >= 3) {
    rating = 'Incomplete / Missing Information';
    label = 'Assessment Incomplete (3+ Dimensions Missing)';
  } else if (hasCriticalSolvencyRisk || hasCriticalOpsRisk || finalScore < 45 || criticalRisks.length >= 2) {
    rating = 'At Risk';
    label = hasCriticalSolvencyRisk 
      ? 'At Risk: Acute Cash Conversion / Working Capital Vulnerability' 
      : 'At Risk: Service Delivery & Operational Capacity Bottleneck';
    finalScore = Math.min(finalScore, 44);
  } else if (finalScore < 70 || inputs.ownerDependency?.status === 'at_risk') {
    rating = 'Needs Attention';
    label = 'Needs Attention: Structural Friction & Scaling Bottlenecks';
    finalScore = Math.min(finalScore, 68);
  } else {
    rating = 'Healthy';
    label = 'Healthy: Commercial Foundations Solid';
  }

  return {
    overallScore: finalScore,
    overallRating: rating,
    scoreLabel: label,
    criticalRisksIdentified: criticalRisks.length > 0 ? criticalRisks : ['No acute failure points identified by owner.'],
    strongestAreas: strongestAreas.length > 0 ? strongestAreas : ['No areas confirmed as fully healthy yet.'],
    missingEvidenceAreas: missingEvidence.length > 0 ? missingEvidence : ['Core 8 dimensions provided.'],
    mainDrivers: mainDrivers.length > 0 ? mainDrivers : ['Baseline operational indicators.'],
    assessmentDate: new Date().toISOString().split('T')[0],
    scoringWeightRules: 'Rule-based scoring: Healthy=100, Needs Attention=50, At Risk=15, Not Sure=35. Unanswered inputs excluded from denominator. Hard constraint: If Money or Operations is At Risk, overall health cannot be rated Healthy regardless of other scores.',
    isProvisional: unansweredCount > 0 || missingEvidence.length > 0,
  };
}

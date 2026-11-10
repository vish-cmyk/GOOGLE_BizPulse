import { 
  ReportedFinancials, 
  RiskMapItem, 
  GrowthOptionAnalysis, 
  TurnaroundAction, 
  MissingInformationItem, 
  WeeklyDashboardKPI,
  ScriptPreset
} from '../types/bizpulse';

export const REPORTED_FINANCIALS: ReportedFinancials = {
  revenue: 1280000,
  directCosts: 760000,
  operatingExpenses: 420000,
  reportedOperatingProfit: 100000,
  accountsReceivable: 175000,
  overdue60Days: 58000,
  reportedPaymentDelayDays: '45–75 days (contract terms: 20 days)',
  supplierPayables: 92000,
  cashInBank: 38000,
  overdraftLimit: 75000,
  overdraftUsed: 52000,
  activeCustomers: 48,
  top5RevenueConcentration: 38,
  top12RecurringConcentration: 60,
  staffCount: 12,
  subcontractors: 2,
};

export const RISK_MAP_ITEMS: RiskMapItem[] = [
  {
    id: 'risk-1',
    category: 'Working Capital & Cash Conversion',
    reportedSymptom: 'Operating profit of NZ$100,000 reported on paper, but bank account is frequently distressed before payroll and supplier payments; NZ$52,000 drawn of NZ$75,000 overdraft facility.',
    possibleUnderlyingCause: 'Potential cash-conversion problem driven by working-capital lag: accounts receivable of NZ$175,000 with NZ$58,000 reported overdue past 60 days, combined with upfront hardware/subcontractor payables of NZ$92,000 paid ahead of debtor realization.',
    evidenceCurrentlyAvailable: [
      'Reported available cash: NZ$38,000.',
      'Reported overdraft drawn: NZ$52,000 out of NZ$75,000 (NZ$23,000 remaining buffer).',
      'Reported receivables: NZ$175,000, with NZ$58,000 &gt;60 days overdue.',
      'Reported customer payment terms: 20 days standard, but realized at 45–75 days.',
      'Reported outstanding supplier liabilities: NZ$92,000.'
    ],
    evidenceStillRequired: [
      'Independent verification of aged debtors ledger (gross vs. disputed vs. bad debts).',
      'Aged payables schedule by due date and vendor stop-supply terms (especially distributor hardware and M365/SaaS licenses).',
      'Upcoming 4-week net cash payroll and statutory tax commitments (PAYE, GST, KiwiSaver).'
    ],
    potentialCommercialConsequence: 'Risk of overdraft facility exhaustion if a single mid-tier customer delays payment, potentially creating short-term supplier delivery holds or payroll funding friction.',
    urgency: 'Immediate (Within 7 Days)',
    recommendedFirstAction: 'Conduct a 48-hour debtor and payable audit to isolate collectable overdue cash and verify upcoming net payroll and tax obligations.',
    hypothesisToTest: 'Hypothesis A1: The cash strain is primarily a timing-driven working-capital conversion issue, not fundamental business unviability.',
    confirmationCriteria: 'Confirmed if aged receivables show &gt;NZ$35,000 in undisputed, collectable invoices from creditworthy customers who will pay upon structured engagement.',
    disproofCriteria: 'Disproved if overdue receivables are disputed due to service delivery defects, or if customer businesses are insolvent/unwilling to pay, necessitating write-offs.'
  },
  {
    id: 'risk-2',
    category: 'Customer Concentration & Pricing',
    reportedSymptom: 'Top 5 customers generate 38% of revenue; top 12 account for ~60% of recurring monthly revenue; 3 customers demanding fee reductions, 1 large client considering a national provider; several contracts frozen for 3 years.',
    possibleUnderlyingCause: 'Potential margin erosion and asymmetric negotiating power: input costs (vendor software and technician wages) reported up ~15%+ over 3 years without contract price indexation, while client concentration limits the owners\' willingness to enforce terms.',
    evidenceCurrentlyAvailable: [
      'Reported 48 active customers (down from 65 peak; 9 lost in last 12 months, 4 downgraded).',
      'Reported 5 largest customers generate 38% of annual revenue (~NZ$486k).',
      'Reported 12 customers generate ~60% of monthly recurring revenue.',
      'Reported contract price freeze of 3 years on key agreements.'
    ],
    evidenceStillRequired: [
      'Individual contract contribution margin (Revenue less direct SaaS licensing less direct technician hours logged at loaded wage rate).',
      'Contract renewal dates, notice windows, and scope definitions for the Top 12 clients.',
      'Underlying reasons for the 9 client departures over the prior 12 months (price vs. service vs. organic business closure).'
    ],
    potentialCommercialConsequence: 'Loss of the single at-risk large account could eliminate NZ$80k–NZ$100k of top-line revenue, which—depending on its true contribution margin—could eliminate the majority of reported operating profit.',
    urgency: 'Immediate (Within 7 Days)',
    recommendedFirstAction: 'Schedule a senior executive account review with the flight-risk customer to understand their operational requirements before negotiating commercial terms.',
    hypothesisToTest: 'Hypothesis B1: Contract contribution margins have compressed significantly due to unbilled scope creep and frozen nominal pricing.',
    confirmationCriteria: 'Confirmed if actual logged technician hours against frozen contracts yield an Effective Hourly Billing Rate (EBR) below NZ$110/hour.',
    disproofCriteria: 'Disproved if delivery hours are modest and contracts generate healthy gross margins exceeding 50% after direct costs.'
  },
  {
    id: 'risk-3',
    category: 'Service Delivery & Technical Capacity',
    reportedSymptom: 'Senior technician is reportedly overloaded single point of failure; two technicians have reportedly signaled intention to leave; unplanned urgent requests displace planned work.',
    possibleUnderlyingCause: 'Operational triage and scope-boundary deficiency: lack of ticket prioritization and unmeasured response/resolution times allow reactive client demands to bypass standard dispatch queues.',
    evidenceCurrentlyAvailable: [
      'Reported technical workforce: 7 technical staff, 2 service-desk staff, 1 account coordinator, 2 subcontractors.',
      'Reported absence of documented technical knowledge for key customer systems.',
      'Reported absence of first-response time, resolution time, and recurring incident reporting.',
      'Reported staff turnover risk among two technicians.'
    ],
    evidenceStillRequired: [
      'PSA/ticketing system data export: ticket volumes, distribution of tickets by engineer, and escalation ratios.',
      'Log of planned vs. reactive hours over the past 60 days.',
      'Exit-risk assessment: whether technicians are disgruntled due to unmanaged client friction, low compensation, or lack of leadership direction.'
    ],
    potentialCommercialConsequence: 'Sudden departure of the senior technician or multiple staff would impair service delivery, trigger SLA breaches, and accelerate client churn among the top 12 concentration group.',
    urgency: 'Immediate (Within 7 Days)',
    recommendedFirstAction: 'Institute an operational dispatch firewall routing 100% of inbound requests through the service desk, establishing a dedicated 4-hour daily focus block for the senior technician.',
    hypothesisToTest: 'Hypothesis C1: Technical capacity is constrained by unmanaged reactive interruptions and out-of-scope work, rather than a raw shortage of technicians.',
    confirmationCriteria: 'Confirmed if triage processes recover 15–20 hours/week of senior technician time currently spent on routine or unbilled requests.',
    disproofCriteria: 'Disproved if baseline contracted maintenance alone genuinely requires &gt;100% of available technical capacity even after strict triage.'
  },
  {
    id: 'risk-4',
    category: 'Governance & Owner Capacity',
    reportedSymptom: 'Owner handles sales, major relationships, quotes, supplier negotiations, and escalations; spouse manages administration, invoicing, payroll coordination, and debt follow-up; disagreements over priorities.',
    possibleUnderlyingCause: 'Owner-dependency trap and operational fragmentation: key processes reside in the owners\' heads, creating a bottleneck that prevents strategic leadership and generates personal strain.',
    evidenceCurrentlyAvailable: [
      'Decisions and escalations stall whenever the owner takes time off.',
      'Spouse manages multiple competing administrative and financial functions without clear prioritization.',
      'Owners disagree on priorities: growth investment vs. operational stabilization.',
      'Discussions frequently spill into after-hours and personal time.'
    ],
    evidenceStillRequired: [
      'Time-audit of owner and spouse hours across administrative, sales, technical, and management tasks.',
      'Documented approval thresholds (e.g. quote authorization, credit terms, discount limits).',
      'Clarity on whether reported NZ$100k profit includes market-rate owner compensation or reflects pre-drawings surplus.'
    ],
    potentialCommercialConsequence: 'Decision fatigue leading to impulsive capital commitments (e.g. premature hiring or agency spend) or operational gridlock during client escalations.',
    urgency: 'High (Within 30 Days)',
    recommendedFirstAction: 'Establish a structured 45-minute weekly management review with a 6-metric scoreboard to separate fact-based business decisions from personal time.',
    hypothesisToTest: 'Hypothesis D1: Disagreements between owners stem from the absence of a shared, fact-based dashboard rather than incompatible business objectives.',
    confirmationCriteria: 'Confirmed if establishing clear weekly cash and workload metrics resolves priority conflicts between sales and stabilization.',
    disproofCriteria: 'Disproved if fundamental disagreement persists over the long-term vision, risk tolerance, or commercial direction of the business.'
  }
];

export const GROWTH_OPTIONS_EVALUATION: GrowthOptionAnalysis[] = [
  {
    id: 'Option A',
    title: 'Option A: NZ$20,000 Marketing Expenditure',
    proposedAction: 'Engage external marketing agency for website redesign and lead generation campaign.',
    upfrontCashRequirement: 'NZ$20,000 direct cash outlay (represents 52.6% of current reported cash buffer of NZ$38,000, or 87% of remaining overdraft headroom of NZ$23,000).',
    likelyOngoingCommitments: 'Ongoing agency retainer (typically NZ$2,000–$4,000/month), digital advertising media spend (NZ$1,000–$3,000/month), and internal management time required to review copy, creatives, and inbound enquiries.',
    whatMustBeTrue: [
      'The business must have clear working-capital headroom to fund the campaign without risking payroll or supplier payments.',
      'A clearly defined Ideal Customer Profile (ICP) and value proposition must exist that differentiates the firm from cheaper alternatives.',
      'Technical delivery capacity must exist to onboard and service newly acquired clients without worsening existing technician burnout.',
      'The sales conversion process must be documented so inbound leads convert into profitable contracts.'
    ],
    commercialAssumptionsToTest: [
      'Assumption 1: An updated website and digital marketing will generate qualified B2B decision-maker leads in the local NZ SME market.',
      'Assumption 2: Inbound leads will be willing to pay sustainable rates rather than shopping on price like current churned customers.',
      'Assumption 3: The owners have the available hours to qualify, quote, and close leads promptly.'
    ],
    routeToRevenueAndCash: 'Campaign launch (Weeks 1–4) → Inbound lead generation (Weeks 5–8) → Discovery and scoping meetings (Weeks 9–12) → Proposal and contract negotiation (Weeks 13–16) → Onboarding and first monthly billing (Month 4–5) → Cash collection under 20-day terms (Month 5–6). Estimated cash lag: 120–180 days from initial dollar spent.',
    principalRisks: [
      'Severe liquidity risk: Outlay of NZ$20k immediately reduces cash buffer to NZ$18,000, leaving negligible margin for debtor delays.',
      'Capacity dilution: Generating inbound leads while technicians are burning out risks service failures on both new and existing clients.',
      'Low agency conversion: Agencies unfamiliar with B2B MSP sales often deliver low-intent, price-sensitive consumer/micro-business clicks.',
      'Opportunity cost: Ignores the existing database of 300 warm past contacts that could be re-engaged at zero external media cost.'
    ],
    evidenceRequiredBeforeCommitment: [
      'Rolling 13-week cash-flow forecast demonstrating positive cash balances after full payment of NZ$20k plus marketing overheads.',
      'Documented conversion rate and sales cycle duration from the firm\'s historical referral leads.',
      'Audit confirming spare technical capacity to onboard at least 3–5 new managed service clients.'
    ],
    approvalConditions: [
      'Approved ONLY IF: Overdraft drawn balance is reduced to zero, cash reserve exceeds 4 weeks of operating expenses, and technical delivery process has documented capacity.'
    ],
    deferralConditions: [
      'Deferred IF: The business has potential for positive marketing returns, but immediate cash flow and technical stabilization must be completed first (recommend re-evaluating at Day 60–90).'
    ],
    rejectionConditions: [
      'Rejected IF: Agency proposal lacks B2B IT MSP case studies, guarantees only "traffic/impressions" rather than qualified sales meetings, or requires long-term lock-in contracts.'
    ],
    calculationFramework: {
      formula: 'Break-Even Contracts Required = Total Campaign Investment ÷ (Annual Contract Revenue × Estimated Gross Margin %)',
      requiredInputs: [
        'Total Campaign Outlay (Upfront + Media Spend + Retainer over 6 months)',
        'Average Annual Contract Value (ACV) of newly acquired client',
        'True Gross Contribution Margin % (Revenue less direct SaaS less delivery wages)',
        'Customer Acquisition Cost (CAC) Payback Period in months'
      ],
      explanation: 'Example framework: If total 6-month marketing cost is NZ$35,000, and average client generates NZ$15,000 ACV at 40% gross margin (NZ$6,000 annual margin contribution), the business must close 5.8 (say 6) new clients simply to recover the marketing cash outlay within year one.'
    }
  },
  {
    id: 'Option B',
    title: 'Option B: Recruit Salesperson at NZ$85,000 Base Salary',
    proposedAction: 'Recruit a dedicated full-time Business Development Manager (BDM) to drive new customer acquisition.',
    upfrontCashRequirement: 'Recruitment fees (typically 15–20% of base = NZ$12,750–$17,000 if using an agency, or internal recruitment time), hardware/laptop setup (NZ$3,000), mobile and CRM tooling (NZ$500/month).',
    likelyOngoingCommitments: 'Fixed monthly payroll commitment: NZ$85,000 base + 3% KiwiSaver + ACC levies (~NZ$89,500/yr or ~NZ$7,460/month fixed), plus commission/incentives, travel, and entertainment expenses.',
    whatMustBeTrue: [
      'A predictable, qualified lead generation mechanism must exist to keep the salesperson\'s calendar occupied with qualified discovery meetings.',
      'A documented, repeatable sales methodology (pricing models, scoping templates, service definitions) must exist for a non-owner to execute.',
      'The business must have working capital to fund 6–9 months of salary (NZ$45k–$65k cash) before the salesperson achieves cash-neutral sales contribution.',
      'The technical delivery organization must be capable of onboarding new accounts without owner intervention.'
    ],
    commercialAssumptionsToTest: [
      'Assumption 1: A salesperson can successfully sell technical managed services without requiring Vish in every technical scoping meeting.',
      'Assumption 2: The local market has sufficient demand to generate 3–5 qualified opportunities per week for an outbound representative.',
      'Assumption 3: The company\'s pricing and value proposition are commercially competitive against mid-market and national MSPs.'
    ],
    routeToRevenueAndCash: 'Recruitment and hiring (Month 1–2) → Onboarding, product training, pipeline building (Month 2–4) → First qualified proposals submitted (Month 4–5) → First deals closed (Month 5–7) → Client onboarding and billing (Month 6–8) → Cash collection (Month 7–9). Typical MSP salesperson cash-neutral break-even point is 9–12 months.',
    principalRisks: [
      'Fixed cost inflation: Adds ~NZ$7,460/month to overheads when reported operating profit is only ~NZ$8,333/month, virtually eliminating the entire profit buffer.',
      'Salesperson failure / Mis-hire: Industry benchmark indicates ~50% of new MSP sales hires fail to reach quota within 12 months, resulting in substantial sunk cost.',
      'Commercial distortion: Under pressure to hit targets, an unsupervised salesperson may discount prices, promise out-of-scope services, or close poor-fit clients.',
      'Owner time displacement: Vish may spend more time coaching, managing, and attending sales meetings with the salesperson than he currently spends selling.'
    ],
    evidenceRequiredBeforeCommitment: [
      'A validated, written sales playbook with standardized pricing calculators, proposal templates, and service boundaries.',
      'Documented evidence of where the salesperson will source leads (list of target accounts, qualified inbound channels).',
      'Ring-fenced cash reserve or committed credit line dedicated to funding 6 months of compensation without operational risk.'
    ],
    approvalConditions: [
      'Approved ONLY IF: The business has a validated lead source, documented qualification criteria, and a financial buffer capable of absorbing 6 months of salary without threatening solvency.'
    ],
    deferralConditions: [
      'Deferred IF: Owner-led sales can still be improved by standardizing packages, tapping the 300 dormant contacts, and delegating administrative tasks first (recommend deferral for 90–180 days).'
    ],
    rejectionConditions: [
      'Rejected IF: The owner expects the salesperson to create their own lead generation system from scratch without marketing support or defined target accounts.'
    ],
    calculationFramework: {
      formula: 'Sales Quota Required to Break Even = (Total Loaded Compensation + Travel/Tools) ÷ Gross Contribution Margin %',
      requiredInputs: [
        'Total Loaded Salary and Commission package',
        'Average Contract Value and Duration',
        'Gross Contribution Margin % across Recurring and Project revenue',
        'Average Sales Cycle Length and Close Rate %'
      ],
      explanation: 'Example framework: If fully loaded cost is NZ$105,000/year and the gross margin on new managed services is 45%, the salesperson must generate at least NZ$233,333 in annual gross profit or ~NZ$518,000 in new annual contract revenue simply to break even.'
    }
  },
  {
    id: 'Option C',
    title: 'Option C: Defer Major Growth Spending Temporarily (Validate Cash, Margin & Capacity)',
    proposedAction: 'Impose a structured 60–90 day moratorium on major discretionary capital expenditure while validating cash conversion, customer profitability, contract pricing, and operational capacity.',
    upfrontCashRequirement: 'NZ$0 external capital outlay; requires internal management focus and discipline.',
    likelyOngoingCommitments: 'Weekly 45-minute management review meeting; focused time to conduct customer margin audits and overdue collection follow-ups.',
    whatMustBeTrue: [
      'The current customer base and revenue of NZ$1.28M possesses sufficient intrinsic profitability if pricing and collections are corrected.',
      'The owners are prepared to make difficult commercial decisions regarding slow-paying or unprofitable contracts.',
      'Operational capacity can be unlocked by filtering reactive interruptions and establishing clear service boundaries.',
      'The existing database of 300 dormant contacts can provide low-cost revenue opportunities without third-party agency spending.'
    ],
    commercialAssumptionsToTest: [
      'Assumption 1: A significant portion of current cash pressure is solvable internally via debt recovery and working-capital controls.',
      'Assumption 2: Existing clients will accept reasonable price adjustments (e.g. 5–10%) after a 3-year freeze if framed around security and service quality.',
      'Assumption 3: Reclaiming unbilled technician hours will resolve capacity pressure without hiring additional technical headcount.'
    ],
    routeToRevenueAndCash: 'Immediate overdue cash collection (Days 1–14) → Immediate overdraft reduction and interest savings (Days 7–30) → Selective contract price reviews and scope addendums (Days 30–60) → Targeted re-engagement of 300 warm contacts with packaged security audits (Days 60–90). Direct cash generation begins within 7–14 days.',
    principalRisks: [
      'Owner frustration: Requires resisting the emotional urge to "do something big" (like hiring or rebranding) while doing the unglamorous work of operational cleanup.',
      'Client friction: Enforcing 20-day credit terms or renegotiating legacy contracts may trigger pushback from customers accustomed to loose arrangements.',
      'Execution slippage: Risk that operational emergencies distract the owners from completing the margin and debtor reviews.'
    ],
    evidenceRequiredBeforeCommitment: [
      'Completed 48-hour cash and debtor diagnostic confirming that overdue AR and working capital improvements can bridge immediate funding needs.',
      'Mutual agreement between Vish and his partner to prioritize operational stabilization for the next 60 days.'
    ],
    approvalConditions: [
      'Approved: Strongly recommended as the primary immediate commercial strategy for the next 60–90 days.'
    ],
    deferralConditions: [
      'Not applicable: Deferral would mean committing capital to Option A or B prematurely.'
    ],
    rejectionConditions: [
      'Rejected ONLY IF: The existing business model is proven structurally unviable even at full capacity and 100% collection, which current evidence does not indicate.'
    ],
    calculationFramework: {
      formula: 'Internal Cash Unlocked = Recovered Overdue AR + Overdraft Interest Saved + (Recurring Revenue × Price Adjustment %) + Unbilled Scope Recovered',
      requiredInputs: [
        'Collectable portion of NZ$58k overdue debt',
        'Annual bank overdraft interest rate (e.g. 11–13%)',
        'Recurring contract revenue base and realistic price adjustment %',
        'Unbilled technical hours converted to billable project revenue at standard rate'
      ],
      explanation: 'Example framework: Recovering NZ$35,000 of overdue debt + 8% price adjustment on NZ$750k recurring base (NZ$60k/yr) + saving NZ$5k in overdraft interest generates over NZ$100,000 in direct cash and profit improvements with zero external capital expenditure.'
    }
  }
];

export const PRIORITISED_TURNAROUND_PLAN: TurnaroundAction[] = [
  // HORIZON 1: FIRST 7 DAYS — ESTABLISH CONTROL
  {
    id: 'h1-1',
    horizon: 'Horizon 1 (First 7 Days)',
    priority: 'Priority 1 (Urgent)',
    action: 'Debtor Verification & Realisable Cash Extraction',
    accountableRole: 'Finance & Administration Lead (Spouse/Accountant)',
    timeframe: 'Days 1–3',
    requiredInformationOrResources: [
      'Detailed Aged Debtors trial balance showing invoice dates, customer names, contact persons, and notes.',
      'List of any known dispute or invoice discrepancies.'
    ],
    measurableSuccessIndicator: 'Categorisation of 100% of the NZ$58,000 overdue receivables into: (a) Immediately collectable, (b) Payment plan required, (c) Formal dispute / at-risk.',
    dependencyOrRisk: 'Risk: Debtors claim disputes over service quality or unfulfilled requests. Mitigation: Obtain technical log before calling.',
    completed: false
  },
  {
    id: 'h1-2',
    horizon: 'Horizon 1 (First 7 Days)',
    priority: 'Priority 1 (Urgent)',
    action: 'Executive Cash Commitments & Payroll Verification Audit',
    accountableRole: 'Finance & Administration Lead',
    timeframe: 'Days 2–4',
    requiredInformationOrResources: [
      'Upcoming 4-week calendar of non-negotiable cash outflows: net staff payroll, subcontractor invoices, IRD statutory tax liabilities (GST/PAYE), and vendor SaaS bills.',
      'Supplier payables ledger (NZ$92,000) breakdown by due date.'
    ],
    measurableSuccessIndicator: 'A 4-week rolling cash disbursement schedule establishing the minimum weekly cash required to maintain vendor supply and payroll.',
    dependencyOrRisk: 'Risk: Inadvertently prioritizing non-critical trade payables ahead of staff payroll or cloud license commitments.',
    completed: false
  },
  {
    id: 'h1-3',
    horizon: 'Horizon 1 (First 7 Days)',
    priority: 'Priority 1 (Urgent)',
    action: 'Direct Owner-to-Owner Telephone Engagement on Critical Accounts',
    accountableRole: 'Managing Director / Commercial Lead (Vish)',
    timeframe: 'Days 3–6',
    requiredInformationOrResources: [
      'Contact details of Managing Directors / Financial Controllers for the top 5 debtor accounts representing the majority of the NZ$58k overdue debt.',
      'Clear script offering structured electronic payment or 50% split arrangements.'
    ],
    measurableSuccessIndicator: 'Direct telephone contact made with all 5 accounts; written confirmation of at least NZ$25,000 in payment commitments within 7–10 days.',
    dependencyOrRisk: 'Risk: Customer expresses resentment at sudden enforcement. Mitigation: Frame conversation respectfully around banking requirements and service continuity.',
    completed: false
  },
  {
    id: 'h1-4',
    horizon: 'Horizon 1 (First 7 Days)',
    priority: 'Priority 2 (High)',
    action: 'Service Desk Triage Firewall & Senior Tech Shielding',
    accountableRole: 'Service Desk Lead / Senior Technical Lead',
    timeframe: 'Days 2–5',
    requiredInformationOrResources: [
      'Phone system / PBX routing configuration.',
      'Ticketing system dispatch queues and email ingestion rules.'
    ],
    measurableSuccessIndicator: '100% of customer phone calls and emails routed strictly through service desk; senior technician allocated a daily 4-hour uninterrupted deep-work window (10:00 AM – 2:00 PM).',
    dependencyOrRisk: 'Risk: Habitual customers calling senior technician\'s mobile directly. Mitigation: Professional voicemail redirecting callers to central dispatch.',
    completed: false
  },
  {
    id: 'h1-5',
    horizon: 'Horizon 1 (First 7 Days)',
    priority: 'Priority 2 (High)',
    action: 'Executive Outreach to At-Risk Flight-Risk Customer',
    accountableRole: 'Managing Director / Commercial Lead',
    timeframe: 'Days 4–7',
    requiredInformationOrResources: [
      'Historical service ticket summary and infrastructure profile for the large client considering a national MSP.',
      'Meeting agenda focused on 12-month strategic roadmap and proactive cybersecurity.'
    ],
    measurableSuccessIndicator: 'Face-to-face meeting or video conference scheduled with key decision-maker; commitment secured to review technology plan before any supplier decision.',
    dependencyOrRisk: 'Risk: Customer uses meeting to demand an immediate fee discount. Mitigation: Do not discount; propose scope alignment or upgraded security bundling.',
    completed: false
  },
  {
    id: 'h1-6',
    horizon: 'Horizon 1 (First 7 Days)',
    priority: 'Priority 3 (Medium)',
    action: 'Enact Interim Hardware & Out-of-Scope Billing Protocols',
    accountableRole: 'Managing Director & Finance Lead',
    timeframe: 'Day 5 onward',
    requiredInformationOrResources: [
      'Updated quotation template with standard payment terms: 100% prepayment on hardware or direct distributor leasing.',
      'Out-of-scope hourly rate card (e.g. NZ$165/hr) for non-covered project work.'
    ],
    measurableSuccessIndicator: 'Zero new hardware orders placed on supplier account without 100% cleared customer deposit; staff instructed on out-of-scope identification.',
    dependencyOrRisk: 'Risk: Sales team or technicians fearing customer pushback. Mitigation: Provide clear email copy explaining supplier credit constraints.',
    completed: false
  },

  // HORIZON 2: DAYS 8–30 — CORRECT UNDERLYING CAUSES
  {
    id: 'h2-1',
    horizon: 'Horizon 2 (Days 8–30)',
    priority: 'Priority 1 (Urgent)',
    action: 'Customer & Service Line Contribution Margin Review',
    accountableRole: 'Commercial Lead & Finance Lead',
    timeframe: 'Days 8–18',
    requiredInformationOrResources: [
      'Export of 6 months of client billing history combined with PSA logged technician hours and third-party software licensing costs.',
      'Standard loaded technician cost model (~NZ$55–$65/hour).'
    ],
    measurableSuccessIndicator: 'Completed customer profitability matrix ranking all 48 customers into 4 quartiles based on Gross Margin % and Effective Hourly Billing Rate (EBR).',
    dependencyOrRisk: 'Risk: Ticketing data has missing or inaccurate time logs. Mitigation: Use sample audit of last 60 days to extrapolate baseline hours.',
    completed: false
  },
  {
    id: 'h2-2',
    horizon: 'Horizon 2 (Days 8–30)',
    priority: 'Priority 1 (Urgent)',
    action: 'Structured Contract Price & Scope Realignment (Phase 1)',
    accountableRole: 'Managing Director / Commercial Lead',
    timeframe: 'Days 15–28',
    requiredInformationOrResources: [
      'Audit of all customer contracts identifying agreements frozen for &gt;2 years.',
      'Formally drafted 30-day price adjustment notice explaining cost inflation and cybersecurity tooling additions.'
    ],
    measurableSuccessIndicator: 'Formal price review notices (5–10% adjustment) issued to the first cohort of low-margin or price-frozen contracts, with clear scope specifications.',
    dependencyOrRisk: 'Risk: Churn of 1–2 highly price-sensitive customers. Mitigation: Pre-calculate capacity freed up; losing unprofitable accounts improves net cash flow.',
    completed: false
  },
  {
    id: 'h2-3',
    horizon: 'Horizon 2 (Days 8–30)',
    priority: 'Priority 2 (High)',
    action: 'Debtor Governance & Direct Debit Migration Policy',
    accountableRole: 'Finance & Administration Lead',
    timeframe: 'Days 10–25',
    requiredInformationOrResources: [
      'Setup of automated Direct Debit / pre-authorized debit facility (e.g. GoCardless for Xero/accounting).',
      'Standardized credit terms documentation (strict 20th of the month following invoice).'
    ],
    measurableSuccessIndicator: 'Migration of at least 30% of recurring monthly clients to automated direct debit; reduction in total overdue receivables &gt;45 days by 50%.',
    dependencyOrRisk: 'Risk: Customers resisting automated debit. Mitigation: Offer incentive or require direct debit as a condition of maintaining current support rates.',
    completed: false
  },
  {
    id: 'h2-4',
    horizon: 'Horizon 2 (Days 8–30)',
    priority: 'Priority 2 (High)',
    action: 'Technical Runbook Documentation & Knowledge Transfer Sprint',
    accountableRole: 'Senior Technical Lead & Technical Team',
    timeframe: 'Days 15–30',
    requiredInformationOrResources: [
      'Internal documentation portal / knowledge base (IT Glue, Hudu, or SharePoint wiki).',
      'Protected 3 hours weekly documentation block for senior technician.'
    ],
    measurableSuccessIndicator: 'Documentation of the top 10 most frequent standard operating procedures (M365 user onboarding, backup restoration, firewall rules, VPN setup); 25% escalation reduction.',
    dependencyOrRisk: 'Risk: Technicians prioritizing reactive tickets over documentation. Mitigation: Enforce documentation time as non-negotiable management priority.',
    completed: false
  },
  {
    id: 'h2-5',
    horizon: 'Horizon 2 (Days 8–30)',
    priority: 'Priority 3 (Medium)',
    action: 'Administration & Role Boundary Streamlining',
    accountableRole: 'Joint Owners',
    timeframe: 'Days 20–30',
    requiredInformationOrResources: [
      'List of recurring administrative tasks performed by spouse and owner.',
      'Delegation guidelines for account coordinator and service-desk dispatch.'
    ],
    measurableSuccessIndicator: 'Delegation of routine invoicing, supplier receipting, and first-line billing inquiries to administrative staff; recovery of 10 hours/week for spouse.',
    dependencyOrRisk: 'Risk: Quality errors during delegation handoff. Mitigation: Provide written step-by-step checklists.',
    completed: false
  },

  // HORIZON 3: DAYS 31–90 — BUILD SUSTAINABLE GROWTH
  {
    id: 'h3-1',
    horizon: 'Horizon 3 (Days 31–90)',
    priority: 'Priority 1 (Urgent)',
    action: 'Database Re-engagement: 300 Warm Contacts Campaign',
    accountableRole: 'Managing Director / Commercial Lead',
    timeframe: 'Days 35–60',
    requiredInformationOrResources: [
      'Cleaned CRM database of the 300 historical customers, prospects, and local business contacts.',
      'Educational email sequence focused on New Zealand cybersecurity compliance (CERT NZ, Privacy Act, Essential 8, Cyber Insurance requirements).'
    ],
    measurableSuccessIndicator: '300 contacts systematically engaged; minimum 20 discovery calls booked; generation of 4–6 new high-margin security audits or recurring support agreements.',
    dependencyOrRisk: 'Risk: Over-commercializing or sending generic marketing spam. Mitigation: Personalize communications from Vish\'s direct email address.',
    completed: false
  },
  {
    id: 'h3-2',
    horizon: 'Horizon 3 (Days 31–90)',
    priority: 'Priority 2 (High)',
    action: 'Customer Retention & Concentration Risk Management Program',
    accountableRole: 'Commercial Lead & Account Coordinator',
    timeframe: 'Days 40–75',
    requiredInformationOrResources: [
      'Quarterly Business Review (QBR) template and technology roadmap framework.',
      'Schedule of quarterly touchpoints for all Top 12 clients.'
    ],
    measurableSuccessIndicator: '100% of Top 12 customers receive a formal technology roadmap and security review; zero unplanned client departures in the quarter.',
    dependencyOrRisk: 'Risk: Client fatigue if meetings provide no strategic value. Mitigation: Focus QBRs entirely on business risk reduction and productivity improvements.',
    completed: false
  },
  {
    id: 'h3-3',
    horizon: 'Horizon 3 (Days 31–90)',
    priority: 'Priority 2 (High)',
    action: 'Standardized Packaging & Service Catalog Definition',
    accountableRole: 'Managing Director & Technical Lead',
    timeframe: 'Days 50–80',
    requiredInformationOrResources: [
      'Definition of standard managed service tiers (e.g. Foundation, Professional, Secure Workspace).',
      'Explicit boundary definitions: what is covered under flat monthly fee vs. billable project work.'
    ],
    measurableSuccessIndicator: 'Publishing of standardized service catalog; elimination of custom bespoke pricing for new sales prospects.',
    dependencyOrRisk: 'Risk: Existing customers resisting boundary clarity. Mitigation: Apply new terms at annual contract renewal dates.',
    completed: false
  },
  {
    id: 'h3-4',
    horizon: 'Horizon 3 (Days 31–90)',
    priority: 'Priority 3 (Medium)',
    action: 'Growth Capacity Trigger Assessment (Sales & Tech Hiring Decision Gates)',
    accountableRole: 'Joint Owners',
    timeframe: 'Days 75–90',
    requiredInformationOrResources: [
      '90-day financial results: operating cash balance, overdraft balance, customer churn, and average gross margin %.',
      'PSA capacity report: billable utilization % and senior tech overtime hours.'
    ],
    measurableSuccessIndicator: 'Formal management evaluation of whether pre-conditions for Option A (Marketing) or Option B (Salesperson) or technical hiring have been achieved.',
    dependencyOrRisk: 'Risk: Premature hiring if conditions are only partially met. Mitigation: Strictly adhere to decision gates.',
    completed: false
  }
];

export const MISSING_INFORMATION_CHECKLIST: MissingInformationItem[] = [
  {
    priority: 'Immediate (Next 48–72 Hours)',
    category: 'Debtors & Working Capital',
    item: 'Detailed Aged Debtors Ledger by Invoice Date & Dispute Status',
    decisionItEnables: 'Determines realistic immediate cash extraction, identifies genuine bad debt write-offs, and establishes which customers require formal stop-work notices.',
    sourceOrMethod: 'Accounting software (Xero/MYOB) export: Aged Receivables Detail report.',
    ownerQuestion: 'Which specific customers make up the NZ$58,000 overdue past 60 days, and are any of these balances actively disputed due to service issues?'
  },
  {
    priority: 'Immediate (Next 48–72 Hours)',
    category: 'Payables & Cash Commitments',
    item: '4-Week Non-Discretionary Cash Commitments Schedule',
    decisionItEnables: 'Reveals true minimum weekly cash required to prevent vendor supply cut-offs and guarantee staff payroll over the next month.',
    sourceOrMethod: 'Aged payables schedule, upcoming payroll run figures, and IRD statutory payment calendar (GST/PAYE).',
    ownerQuestion: 'What are the exact due dates and dollar amounts for net payroll, tax, and supplier invoices due over the next 28 days?'
  },
  {
    priority: 'Immediate (Next 48–72 Hours)',
    category: 'Customer Concentration',
    item: 'Top 12 Customer Profile & Contract Terms',
    decisionItEnables: 'Identifies immediate contract renewal risks, pricing freeze status, and notice periods for the accounts generating 60% of recurring revenue.',
    sourceOrMethod: 'Signed customer service agreements, monthly recurring invoicing history.',
    ownerQuestion: 'When do the contracts for our 5 largest clients expire, what are their 30-day notice terms, and when was their last price review?'
  },
  {
    priority: 'Immediate (Next 48–72 Hours)',
    category: 'Technical Workforce',
    item: 'Technician Retention & Workload Diagnostic',
    decisionItEnables: 'Identifies immediate flight risk of key technical personnel and determines what immediate operational relief is required to preserve service continuity.',
    sourceOrMethod: 'Confidential 1-on-1 check-in with senior technician and service desk dispatch.',
    ownerQuestion: 'What are the specific, actionable frustrations driving the two technicians to consider leaving, and what immediate changes would keep them?'
  },
  {
    priority: 'Secondary (Within 14–30 Days)',
    category: 'Service Delivery & PSA',
    item: '60-Day Ticketing Workload & Escalation Log',
    decisionItEnables: 'Determines whether capacity problems require hiring another technician (Option E) or can be resolved through helpdesk triage and documentation.',
    sourceOrMethod: 'Ticketing system export: ticket counts by category, tech assignment, and resolution time.',
    ownerQuestion: 'How many total tickets were opened last month, what percentage were reactive emergencies, and how many hours did our senior tech spend on routine tickets?'
  },
  {
    priority: 'Secondary (Within 14–30 Days)',
    category: 'Customer Profitability',
    item: 'Direct SaaS & Third-Party Licensing Cost per Customer',
    decisionItEnables: 'Enables calculation of true gross contribution margin per customer to pinpoint contracts requiring price increases or termination.',
    sourceOrMethod: 'Vendor billing statements (Microsoft CSP, Datto, Sophos, Pax8, Ingram Micro) mapped to customer accounts.',
    ownerQuestion: 'What is our exact monthly third-party software licensing cost for each of our top 20 customers?'
  },
  {
    priority: 'Secondary (Within 14–30 Days)',
    category: 'Owner Compensation',
    item: 'Baseline Owner Drawings vs. Market Remuneration',
    decisionItEnables: 'Clarifies whether the reported NZ$100,000 profit is an actual economic surplus or is artificially inflated by below-market owner drawings.',
    sourceOrMethod: 'Historical drawings ledgers, director salary records, personal tax returns.',
    ownerQuestion: 'What total drawings and salaries did Vish and his partner take out of the business over the last financial year?'
  }
];

export const WEEKLY_DASHBOARD_KPIS: WeeklyDashboardKPI[] = [
  {
    id: 'kpi-1',
    name: 'Cash Buffer & Overdraft Headroom',
    area: 'Cash & Working Capital',
    currentReportedValue: 'NZ$38,000 cash | NZ$52,000 OD drawn (NZ$23,000 headroom)',
    targetBenchmark: 'Zero Overdraft usage | Minimum NZ$60,000 unencumbered cash buffer (approx. 4 weeks payroll)',
    warningThreshold: 'Overdraft usage &gt; NZ$55,000 (headroom &lt; NZ$20,000)',
    criticalThreshold: 'Overdraft usage &gt; NZ$65,000 (headroom &lt; NZ$10,000) or cash &lt; NZ$15,000',
    accountableRole: 'Finance & Administration Lead',
    measurementFrequency: 'Weekly on Monday 9:00 AM',
    explanation: 'Unencumbered cash balance plus remaining usable credit facility line before weekly vendor payables run.',
    criteriaExplanation: 'Criteria: Critical threshold indicates less than 10 days of operating expenses remaining before credit facility exhaustion.'
  },
  {
    id: 'kpi-2',
    name: 'Aged Receivables &gt;45 Days & Total Debtors',
    area: 'Debtors & Working Capital',
    currentReportedValue: 'Total AR: NZ$175,000 | Overdue &gt;60 days: NZ$58,000 (33.1%)',
    targetBenchmark: 'Total AR &lt; NZ$80,000 | Overdue &gt;45 days: &lt; NZ$10,000 (DSO under 25 days)',
    warningThreshold: 'Overdue &gt;45 days &gt; NZ$25,000',
    criticalThreshold: 'Overdue &gt;45 days &gt; NZ$40,000 or any single customer &gt;60 days exceeding NZ$10,000',
    accountableRole: 'Finance & Administration Lead',
    measurementFrequency: 'Weekly on Monday 9:00 AM',
    explanation: 'Total unpaid invoices past standard 20th of the month terms, categorized into current, 30-day, and 60+ day aging brackets.',
    criteriaExplanation: 'Criteria: Receivables past 45 days represent unauthorized customer financing directly driving overdraft usage.'
  },
  {
    id: 'kpi-3',
    name: 'Effective Hourly Billing Rate (EBR) on Managed Contracts',
    area: 'Profitability & Margin',
    currentReportedValue: 'Estimated NZ$85–$95/hour (unverified baseline)',
    targetBenchmark: 'EBR ≥ NZ$145/hour across all recurring contract tiers',
    warningThreshold: 'EBR between NZ$110 and NZ$130/hour',
    criticalThreshold: 'EBR &lt; NZ$105/hour across any major contract (indicates unbilled scope loss)',
    accountableRole: 'Managing Director / Commercial Lead',
    measurementFrequency: 'Monthly review (sample tracked weekly)',
    explanation: 'Calculated as: Total Monthly Contract Retainer Revenue ÷ Total Technician Hours Logged for That Contract.',
    criteriaExplanation: 'Criteria: With loaded tech labor costs at ~NZ$58/hour and overheads, an EBR below NZ$110 yields insufficient margin to support fixed expenses.'
  },
  {
    id: 'kpi-4',
    name: 'Top 12 Customer Health & Retention Index',
    area: 'Client Health & Concentration',
    currentReportedValue: '1 Client High Flight Risk (national MSP) | 3 Clients Requesting Fee Cuts | 8 Stable',
    targetBenchmark: '12 out of 12 Green (verified satisfied, QBR held within 90 days, no fee disputes)',
    warningThreshold: 'Any Top 12 customer flagging service dissatisfaction or unaddressed escalation',
    criticalThreshold: 'Any Top 5 customer issuing formal tender notice or demanding contract renegotiation',
    accountableRole: 'Managing Director / Commercial Lead',
    measurementFrequency: 'Weekly on Monday 9:00 AM',
    explanation: 'Traffic-light status across the 12 accounts representing 60% of recurring monthly revenue.',
    criteriaExplanation: 'Criteria: Concentration of 38% across 5 clients means any red account represents an existential threat to annual operating profit.'
  },
  {
    id: 'kpi-5',
    name: 'Unplanned Reactive Tickets vs. Planned Project Hours',
    area: 'Service Delivery & Operations',
    currentReportedValue: 'Estimated ~70% reactive / 30% planned (unverified baseline)',
    targetBenchmark: 'Max 30% reactive urgent / Min 70% planned proactive maintenance & billable project work',
    warningThreshold: 'Reactive hours exceeding 45% of total logged engineering hours',
    criticalThreshold: 'Reactive hours exceeding 60% of total logged hours (indicates firefighting crisis)',
    accountableRole: 'Service Desk Lead / Dispatch',
    measurementFrequency: 'Weekly on Monday 9:00 AM',
    explanation: 'Ratio of unplanned emergency interruptions and helpdesk tickets against scheduled maintenance, onboarding, and billable projects.',
    criteriaExplanation: 'Criteria: Reactive dominance over 50% directly predicts technician burnout, ticket backlog growth, and client dissatisfaction.'
  },
  {
    id: 'kpi-6',
    name: 'Senior Technician Escalation Load & Overtime Hours',
    area: 'Staff Capacity & Escalations',
    currentReportedValue: 'Reported overloaded; estimated 45–50 hours/week with continuous interruptions',
    targetBenchmark: 'Max 38 hours/week total; involvement in &lt;15% of total closed service desk tickets',
    warningThreshold: 'Senior tech working &gt;42 hours/week or handling &gt;25% of routine tier-1/2 tickets',
    criticalThreshold: 'Senior tech working weekends or &gt;45 hours/week for 2 consecutive weeks',
    accountableRole: 'Managing Director & Service Desk Lead',
    measurementFrequency: 'Weekly on Monday 9:00 AM',
    explanation: 'Total hours logged and number of escalations assigned to the senior technical lead.',
    criteriaExplanation: 'Criteria: Single point of failure risk. Senior tech resignation would trigger severe delivery disruption across the client base.'
  }
];

export const SCRIPT_PRESETS: ScriptPreset[] = [
  {
    id: 'script-1',
    title: '48-Hour Overdue Account Commercial Notice',
    description: 'Firm, professional notice for accounts overdue past 45 days requesting payment or a 50% split to maintain engineering dispatch.',
    category: 'Cash Collection',
    defaultPrompt: 'Draft a respectful, firm notice for a client 60 days overdue (NZ$14,500). Explain our 20-day terms and request payment within 48 hours or an agreed 50% payment plan to maintain support dispatch.'
  },
  {
    id: 'script-2',
    title: 'Contract Price & Scope Realignment (5–10%)',
    description: 'Notice to long-standing clients announcing price review to reflect 3-year vendor and wage inflation and cybersecurity tooling.',
    category: 'Contract & Pricing',
    defaultPrompt: 'Draft a commercial letter for a client unchanged for 3 years, introducing an 8% adjustment. Explain inflation and enhanced security tooling.'
  },
  {
    id: 'script-3',
    title: 'Strategic Retention Review (At-Risk Large Client)',
    description: 'Executive agenda and talking points for Vish to meet the Managing Director of the large client considering a national MSP.',
    category: 'Client Retention',
    defaultPrompt: 'Provide an executive meeting agenda for Vish to meet the MD of the flight-risk account. Focus on dedicated local engineering and modern security roadmap.'
  },
  {
    id: 'script-4',
    title: 'Service Desk Out-of-Scope Quotation Protocol',
    description: 'Polite script for coordinators to use when client requests out-of-scope work under baseline retainers.',
    category: 'Service Boundaries',
    defaultPrompt: 'Create a polite email for an out-of-scope request, clarifying that we are happy to assist as a billable project at NZ$165/hr.'
  }
];

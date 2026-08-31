import {
  Entity,
  Relationship,
  Loan,
  RiskPattern,
  RiskDNAProfile,
  InterventionVector,
  Alert,
  AuditLog,
  DashboardKPIs,
  PropagationResult,
  ScenarioResult,
  ScenarioParams,
} from '../types/riskflow';

export const INITIAL_KPIS: DashboardKPIs = {
  totalPortfolioExposure: 842.6, // ₹842.6 Cr
  exposureGrowthPct: 2.4, // +2.4%
  expectedLoss: 31.4, // ₹31.4 Cr
  highRiskExposures: 428, // 428 units
  indirectNetworkExposure: 117.8, // ₹117.8 Cr
  modelConfidence: 87, // 87%
  emergingPatternsCount: 4,
  activeAlertsCount: 6,
};

export const INITIAL_ENTITIES: Entity[] = [
  {
    id: 'ent-comp-a',
    name: 'Company A',
    type: 'corporate',
    sector: 'Infrastructure & Logistics',
    region: 'Western Region / Mumbai',
    country: 'IN',
    totalExposure: 26.4,
    riskScore: 82,
    pd: 74,
    directExp: 8.7,
    indirectExp: 17.7,
    riskRating: 'BB',
    isCriticalNode: true,
    transmissionProbability: 82,
    description: 'Tier-1 logistics aggregator experiencing severe liquidity squeeze and receivables delay from major infrastructure client.',
    x: 100,
    y: 130,
    connectedEntityIds: ['ent-comp-b', 'ent-bank-x', 'ent-portfolio-7'],
    historicalVolatility: [32, 35, 41, 38, 48, 55, 62, 71, 78, 82],
    latestEvents: [
      { id: 'ev-1', headline: '30-day working capital facility rollover delayed', timeAgo: '3 hours ago', severity: 'critical' },
      { id: 'ev-2', headline: 'Receivables from primary client overdue by 68 days', timeAgo: '2 days ago', severity: 'warning' },
    ],
  },
  {
    id: 'ent-comp-b',
    name: 'Company B',
    type: 'supplier',
    sector: 'Heavy Components Manufacturing',
    region: 'Western Region / Pune',
    country: 'IN',
    totalExposure: 22.3,
    riskScore: 68,
    pd: 48,
    directExp: 4.1,
    indirectExp: 18.2,
    riskRating: 'BBB',
    isCriticalNode: true,
    transmissionProbability: 71,
    description: 'Key transmission hub in the industrial equipment value chain. Acts as single-source supplier to Company C and 8 sub-tier vendors.',
    x: 320,
    y: 270,
    connectedEntityIds: ['ent-comp-a', 'ent-comp-c', 'ent-comp-e', 'ent-bank-x'],
    historicalVolatility: [22, 24, 28, 30, 35, 42, 51, 60, 64, 68],
    latestEvents: [
      { id: 'ev-3', headline: 'Supply chain bridge financing requested', timeAgo: '6 hours ago', severity: 'warning' },
      { id: 'ev-4', headline: 'Order backlog down 18% QoQ due to customer payment holds', timeAgo: '4 days ago', severity: 'info' },
    ],
  },
  {
    id: 'ent-comp-c',
    name: 'Company C',
    type: 'corporate',
    sector: 'Commercial Vehicles Assembly',
    region: 'Northern Region / Gurgaon',
    country: 'IN',
    totalExposure: 12.5,
    riskScore: 88,
    pd: 79,
    directExp: 3.2,
    indirectExp: 9.3,
    riskRating: 'B',
    isCriticalNode: true,
    transmissionProbability: 88,
    description: 'Downstream vehicle assembly facility heavily reliant on critical component shipments from Company B.',
    x: 580,
    y: 100,
    connectedEntityIds: ['ent-comp-b', 'ent-bank-x'],
    historicalVolatility: [45, 48, 52, 60, 68, 74, 80, 84, 86, 88],
    latestEvents: [
      { id: 'ev-5', headline: 'Assembly line temporary slowdown due to parts shortage', timeAgo: '1 day ago', severity: 'critical' },
    ],
  },
  {
    id: 'ent-comp-d',
    name: 'Company D',
    type: 'corporate',
    sector: 'Renewable Power Transmission',
    region: 'Southern Region / Bengaluru',
    country: 'IN',
    totalExposure: 14.8,
    riskScore: 61,
    pd: 42,
    directExp: 3.8,
    indirectExp: 9.7,
    riskRating: 'BBB',
    description: 'Regional solar developer with cross-collateralized grid integration contracts and high leverage.',
    x: 250,
    y: 420,
    connectedEntityIds: ['ent-portfolio-7', 'ent-comp-e'],
    historicalVolatility: [20, 22, 25, 29, 36, 44, 52, 58, 60, 61],
    latestEvents: [
      { id: 'ev-6', headline: 'PPA tariff negotiation ongoing with state discom', timeAgo: '3 days ago', severity: 'info' },
    ],
  },
  {
    id: 'ent-comp-e',
    name: 'Company E',
    type: 'supplier',
    sector: 'Electrical Grid Sub-contracting',
    region: 'Western Region / Ahmedabad',
    country: 'IN',
    totalExposure: 6.4,
    riskScore: 54,
    pd: 36,
    directExp: 2.1,
    indirectExp: 4.3,
    riskRating: 'A',
    description: 'Tier-2 engineering contractor providing turnkey maintenance to regional logistics and power projects.',
    x: 530,
    y: 430,
    connectedEntityIds: ['ent-comp-b', 'ent-comp-d'],
    historicalVolatility: [18, 19, 21, 24, 29, 35, 42, 48, 51, 54],
    latestEvents: [
      { id: 'ev-7', headline: 'Subcontract payment cycle lengthened from 45 to 75 days', timeAgo: '5 days ago', severity: 'warning' },
    ],
  },
  {
    id: 'ent-evergrande',
    name: 'Evergrande Group',
    type: 'corporate',
    sector: 'Real Estate Development',
    region: 'East Asia / Guangdong',
    country: 'CN',
    totalExposure: 2450.0, // $300.5B equivalent in Cr
    riskScore: 94,
    pd: 92,
    directExp: 840.0,
    indirectExp: 1610.0,
    riskRating: 'C',
    isCriticalNode: true,
    transmissionProbability: 85,
    description: 'Mega property conglomerate undergoing systemic cross-border restructuring with broad domestic supplier spillover.',
    x: 480,
    y: 240,
    connectedEntityIds: ['ent-shengjing', 'ent-supplier-net-a', 'ent-bondholders'],
    historicalVolatility: [60, 64, 72, 78, 85, 89, 91, 92, 93, 94],
    latestEvents: [
      { id: 'ev-8', headline: 'Missed offshore bond payment deadline ($148M tranche)', timeAgo: '2 hours ago', severity: 'critical' },
      { id: 'ev-9', headline: 'Trading suspended on HKEX pending structural disclosure', timeAgo: '1 day ago', severity: 'warning' },
    ],
  },
  {
    id: 'ent-shengjing',
    name: 'Shengjing Bank',
    type: 'bank',
    sector: 'Commercial Banking',
    region: 'East Asia / Shenyang',
    country: 'CN',
    totalExposure: 980.0, // $1.2B
    riskScore: 76,
    pd: 58,
    directExp: 380.0,
    indirectExp: 600.0,
    riskRating: 'BB',
    description: 'Regional joint-stock commercial bank holding substantial bilateral loan book exposure to property developers.',
    x: 620,
    y: 180,
    connectedEntityIds: ['ent-evergrande', 'ent-bondholders'],
    historicalVolatility: [30, 32, 38, 45, 54, 62, 69, 72, 74, 76],
    latestEvents: [
      { id: 'ev-10', headline: 'Capital adequacy buffer stressed; Tier 2 recapitalisation explored', timeAgo: '8 hours ago', severity: 'warning' },
    ],
  },
  {
    id: 'ent-supplier-net-a',
    name: 'Supplier Network A',
    type: 'supplier',
    sector: 'Building Materials & Glass',
    region: 'East Asia / Zhejiang',
    country: 'CN',
    totalExposure: 695.0, // $850M
    riskScore: 89,
    pd: 81,
    directExp: 290.0,
    indirectExp: 405.0,
    riskRating: 'B',
    description: 'Consortium of construction materials suppliers with commercial acceptance bills in default status.',
    x: 640,
    y: 320,
    connectedEntityIds: ['ent-evergrande'],
    historicalVolatility: [40, 44, 52, 61, 70, 78, 83, 86, 88, 89],
    latestEvents: [
      { id: 'ev-11', headline: 'Commercial paper default reported across 4 subsidiary suppliers', timeAgo: '12 hours ago', severity: 'critical' },
    ],
  },
  {
    id: 'ent-bondholders',
    name: 'Global Bondholders',
    type: 'bondholder',
    sector: 'Institutional Fixed Income',
    region: 'Global / Multi-Jurisdiction',
    country: 'US/UK/SG',
    totalExposure: 15500.0, // $19B
    riskScore: 91,
    pd: 86,
    directExp: 5500.0,
    indirectExp: 10000.0,
    riskRating: 'C',
    description: 'Global offshore bond syndicate holding Senior Dollar Notes and unsecured credit default swaps.',
    x: 740,
    y: 220,
    connectedEntityIds: ['ent-evergrande', 'ent-shengjing'],
    historicalVolatility: [50, 55, 63, 72, 81, 86, 89, 90, 91, 91],
    latestEvents: [
      { id: 'ev-12', headline: 'Ad-hoc creditor steering committee formed for debt restructuring', timeAgo: '1 day ago', severity: 'warning' },
    ],
  },
  {
    id: 'ent-bank-x',
    name: 'Bank X',
    type: 'tier1_bank',
    sector: 'Banking & Financial Institutions',
    region: 'National / Mumbai HQ',
    country: 'IN',
    totalExposure: 185.0,
    riskScore: 48,
    pd: 18,
    directExp: 45.2,
    indirectExp: 139.8,
    riskRating: 'AA',
    description: 'Scheduled commercial bank with direct working capital and term debt consortium leadership.',
    x: 200,
    y: 80,
    connectedEntityIds: ['ent-comp-a', 'ent-comp-b', 'ent-comp-c', 'ent-portfolio-7'],
    historicalVolatility: [15, 16, 17, 21, 25, 31, 38, 42, 45, 48],
    latestEvents: [
      { id: 'ev-13', headline: 'Special Mention Account (SMA-1) classification initiated on 2 accounts', timeAgo: '18 hours ago', severity: 'warning' },
    ],
  },
  {
    id: 'ent-portfolio-7',
    name: 'Portfolio 7',
    type: 'borrower',
    sector: 'Structured High-Yield Credit',
    region: 'National',
    country: 'IN',
    totalExposure: 112.5,
    riskScore: 72,
    pd: 64,
    directExp: 38.4,
    indirectExp: 74.1,
    riskRating: 'BB',
    description: 'Specialized mezzanine fund exposure tranche across mid-tier industrial and renewables borrowers.',
    x: 180,
    y: 350,
    connectedEntityIds: ['ent-comp-a', 'ent-comp-d', 'ent-bank-x'],
    historicalVolatility: [25, 28, 34, 40, 49, 56, 63, 68, 70, 72],
    latestEvents: [
      { id: 'ev-14', headline: 'Weighted average debt-service coverage ratio fell to 1.12x', timeAgo: '2 days ago', severity: 'warning' },
    ],
  },
];

export const INITIAL_RELATIONSHIPS: Relationship[] = [
  {
    id: 'rel-1',
    sourceId: 'ent-comp-a',
    targetId: 'ent-comp-b',
    sourceName: 'Company A',
    targetName: 'Company B',
    relationshipType: 'supplier_dependency',
    exposure: 18.2,
    confidence: 0.92,
    weight: 0.88,
    transmissionProb: 0.78,
  },
  {
    id: 'rel-2',
    sourceId: 'ent-comp-b',
    targetId: 'ent-comp-c',
    sourceName: 'Company B',
    targetName: 'Company C',
    relationshipType: 'supplier_dependency',
    exposure: 12.5,
    confidence: 0.89,
    weight: 0.84,
    transmissionProb: 0.85,
  },
  {
    id: 'rel-3',
    sourceId: 'ent-comp-b',
    targetId: 'ent-comp-e',
    sourceName: 'Company B',
    targetName: 'Company E',
    relationshipType: 'loan_exposure',
    exposure: 6.4,
    confidence: 0.85,
    weight: 0.55,
    transmissionProb: 0.42,
  },
  {
    id: 'rel-4',
    sourceId: 'ent-comp-a',
    targetId: 'ent-bank-x',
    sourceName: 'Company A',
    targetName: 'Bank X',
    relationshipType: 'loan_exposure',
    exposure: 14.5,
    confidence: 0.95,
    weight: 0.75,
    transmissionProb: 0.68,
  },
  {
    id: 'rel-5',
    sourceId: 'ent-comp-b',
    targetId: 'ent-bank-x',
    sourceName: 'Company B',
    targetName: 'Bank X',
    relationshipType: 'loan_exposure',
    exposure: 11.2,
    confidence: 0.94,
    weight: 0.62,
    transmissionProb: 0.52,
  },
  {
    id: 'rel-6',
    sourceId: 'ent-comp-a',
    targetId: 'ent-portfolio-7',
    sourceName: 'Company A',
    targetName: 'Portfolio 7',
    relationshipType: 'ownership',
    exposure: 8.7,
    confidence: 0.91,
    weight: 0.70,
    transmissionProb: 0.65,
  },
  {
    id: 'rel-7',
    sourceId: 'ent-comp-d',
    targetId: 'ent-portfolio-7',
    sourceName: 'Company D',
    targetName: 'Portfolio 7',
    relationshipType: 'loan_exposure',
    exposure: 9.7,
    confidence: 0.88,
    weight: 0.64,
    transmissionProb: 0.58,
  },
  {
    id: 'rel-8',
    sourceId: 'ent-comp-e',
    targetId: 'ent-comp-d',
    sourceName: 'Company E',
    targetName: 'Company D',
    relationshipType: 'sector_dependency',
    exposure: 4.8,
    confidence: 0.82,
    weight: 0.48,
    transmissionProb: 0.38,
  },
  {
    id: 'rel-9',
    sourceId: 'ent-evergrande',
    targetId: 'ent-shengjing',
    sourceName: 'Evergrande Group',
    targetName: 'Shengjing Bank',
    relationshipType: 'ownership',
    exposure: 980.0,
    confidence: 0.96,
    weight: 0.92,
    transmissionProb: 0.88,
  },
  {
    id: 'rel-10',
    sourceId: 'ent-evergrande',
    targetId: 'ent-supplier-net-a',
    sourceName: 'Evergrande Group',
    targetName: 'Supplier Network A',
    relationshipType: 'supplier_dependency',
    exposure: 695.0,
    confidence: 0.94,
    weight: 0.90,
    transmissionProb: 0.89,
  },
  {
    id: 'rel-11',
    sourceId: 'ent-evergrande',
    targetId: 'ent-bondholders',
    sourceName: 'Evergrande Group',
    targetName: 'Global Bondholders',
    relationshipType: 'loan_exposure',
    exposure: 15500.0,
    confidence: 0.98,
    weight: 0.95,
    transmissionProb: 0.92,
  },
];

export const INITIAL_INTERVENTIONS: InterventionVector[] = [
  {
    id: 'int-comp-b',
    targetEntityId: 'ent-comp-b',
    targetEntityName: 'Company B',
    title: 'Protect Company B',
    actionName: 'Liquidity Bridge & Receivables Ring-Fencing',
    avoidedLoss: 18.2, // ₹18.2 Cr
    costToIntervene: 4.1, // ₹4.1 Cr
    efficiencyRatio: 4.4, // 4.4x
    confidence: 81, // 81%
    networkCentrality: 0.91,
    isRecommended: true,
    downstreamCount: 9,
    description: 'Company B is the highest-leverage containment point in the current propagation network. Provisioning targeted supply chain receivables stabilization halts downstream contagion to Company C and related vendors.',
    status: 'available',
  },
  {
    id: 'int-comp-d',
    targetEntityId: 'ent-comp-d',
    targetEntityName: 'Company D',
    title: 'Protect Company D',
    actionName: 'Collateral Restructuring & Debt Subordination',
    avoidedLoss: 9.7, // ₹9.7 Cr
    costToIntervene: 3.8, // ₹3.8 Cr
    efficiencyRatio: 2.6, // 2.6x
    confidence: 68,
    networkCentrality: 0.64,
    isRecommended: false,
    downstreamCount: 4,
    description: 'Restructuring Company D power purchase receivables insulates Portfolio 7 from localized solar sector shocks.',
    status: 'available',
  },
  {
    id: 'int-bank-x',
    targetEntityId: 'ent-bank-x',
    targetEntityName: 'Bank X',
    title: 'Syndicate Consortium Standstill',
    actionName: 'Bilateral Covenant Waiver & Buffer Injection',
    avoidedLoss: 34.6,
    costToIntervene: 11.2,
    efficiencyRatio: 3.1,
    confidence: 77,
    networkCentrality: 0.84,
    isRecommended: false,
    downstreamCount: 14,
    description: 'Direct institutional standstill across Bank X loan facilities to prevent cascade of simultaneous acceleration notices.',
    status: 'available',
  },
];

export const INITIAL_PATTERNS: RiskPattern[] = [
  {
    id: 'pat-017',
    code: 'Risk DNA #017',
    title: 'Hidden Cash-Flow Stress',
    description: 'Uncovered latent working capital compression where borrowers maintain acceptable headline credit scores (680+) while commercial payables stretch past 75 days with surging off-balance sheet vendor factoring.',
    clusterSize: 342,
    affectedLoansCount: 2143,
    totalExposure: 348.6,
    averageRisk: 78.4,
    observedDefaultRate: 14.8,
    expectedDefaultRate: 6.2,
    modelGap: 8.6,
    noveltyScore: 0.88,
    confidence: 0.84,
    classification: 'EMERGING',
    firstDetected: '2026-06-14',
    trend: 'increasing',
    dominantFeatures: [
      'Operating cash flow to debt ratio < 0.12',
      'Payables turnover days surge (+38 days)',
      'Sub-tier vendor factoring discounting velocity',
      'Short-term unsecured line utilization > 82%',
    ],
    memberEntityIds: ['ent-comp-a', 'ent-comp-b', 'ent-comp-c', 'ent-portfolio-7'],
  },
  {
    id: 'pat-024',
    code: 'Risk DNA #024',
    title: 'Collateral Cross-Lien Concentration',
    description: 'Multiple mid-tier borrowers pledging overlapping commercial real estate and industrial parcel parcels across distinct NBFCs.',
    clusterSize: 184,
    affectedLoansCount: 842,
    totalExposure: 182.4,
    averageRisk: 66.2,
    observedDefaultRate: 11.2,
    expectedDefaultRate: 4.8,
    modelGap: 6.4,
    noveltyScore: 0.74,
    confidence: 0.89,
    classification: 'EMERGING',
    firstDetected: '2026-07-02',
    trend: 'increasing',
    dominantFeatures: [
      'Secondary mortgage charge unregistered in central registry',
      'Property valuation staleness > 18 months',
      'LTV compression upon stressed realization',
    ],
    memberEntityIds: ['ent-comp-d', 'ent-comp-e'],
  },
  {
    id: 'pat-031',
    code: 'Risk DNA #031',
    title: 'Supply-Chain Transmission Acceleration',
    description: 'High customer concentration where top 2 clients represent >70% of revenue, causing rapid single-point transmission.',
    clusterSize: 128,
    affectedLoansCount: 620,
    totalExposure: 116.8,
    averageRisk: 71.5,
    observedDefaultRate: 12.6,
    expectedDefaultRate: 5.4,
    modelGap: 7.2,
    noveltyScore: 0.81,
    confidence: 0.91,
    classification: 'KNOWN',
    firstDetected: '2026-05-19',
    trend: 'stable',
    dominantFeatures: [
      'Client concentration index HHI > 4,200',
      'Supplier contract cancellation penalty clauses unenforceable',
    ],
    memberEntityIds: ['ent-comp-b', 'ent-comp-c'],
  },
  {
    id: 'pat-042',
    code: 'Risk DNA #042',
    title: 'Interest Rate Shock Sensitivity',
    description: 'Floating rate term loans with interest rate caps expiring within 90 days in rate-sensitive sectors.',
    clusterSize: 215,
    affectedLoansCount: 980,
    totalExposure: 210.5,
    averageRisk: 64.0,
    observedDefaultRate: 9.8,
    expectedDefaultRate: 4.1,
    modelGap: 5.7,
    noveltyScore: 0.65,
    confidence: 0.93,
    classification: 'REGIME_SHIFT',
    firstDetected: '2026-08-01',
    trend: 'increasing',
    dominantFeatures: [
      'DSCR sensitivity > 0.25 drop per +100bps rate hike',
      'Debt burden ratio > 45%',
    ],
    memberEntityIds: ['ent-comp-a', 'ent-comp-d'],
  },
];

export const INITIAL_ALERTS: Alert[] = [
  {
    id: 'alt-1',
    severity: 'critical',
    title: 'Risk Propagation Detected on Company A',
    description: 'Stressed liquidity profile on Company A is propagating to Company B (78% prob) and downstream assembly networks.',
    timestamp: '10 minutes ago',
    affectedEntityId: 'ent-comp-a',
    affectedEntityName: 'Company A',
    status: 'active',
    type: 'propagation',
  },
  {
    id: 'alt-2',
    severity: 'high',
    title: 'Emerging Risk Pattern: Risk DNA #017',
    description: '2,143 loans exhibiting hidden working capital degradation. Observed default rate (14.8%) is 2.4x above baseline expectations.',
    timestamp: '42 minutes ago',
    affectedEntityId: 'ent-comp-b',
    affectedEntityName: 'Company B',
    status: 'active',
    type: 'emerging_dna',
  },
  {
    id: 'alt-3',
    severity: 'high',
    title: 'Cross-Border Transmission Alert: Evergrande Group',
    description: 'Senior offshore bond coupon non-payment triggering cross-default risks across Shengjing Bank and associated suppliers.',
    timestamp: '2 hours ago',
    affectedEntityId: 'ent-evergrande',
    affectedEntityName: 'Evergrande Group',
    status: 'active',
    type: 'threshold_breached',
  },
  {
    id: 'alt-4',
    severity: 'medium',
    title: 'Model Confidence Calibration Warning',
    description: 'Infrastructure sub-portfolio confidence index dipped from 91% to 87% following unexpected working capital volatility.',
    timestamp: '5 hours ago',
    status: 'active',
    type: 'confidence_drop',
  },
  {
    id: 'alt-5',
    severity: 'medium',
    title: 'Portfolio 7 Concentration Threshold Reached',
    description: 'Aggregate indirect exposure to tier-2 industrial contractors exceeded ₹100 Cr threshold limit.',
    timestamp: '1 day ago',
    affectedEntityId: 'ent-portfolio-7',
    affectedEntityName: 'Portfolio 7',
    status: 'active',
    type: 'threshold_breached',
  },
  {
    id: 'alt-6',
    severity: 'info',
    title: 'Quarterly Risk Engine Model Retraining Completed',
    description: 'Baseline PD model v4.2 calibrated with updated economic sensitivity tensors and historical delinquency records.',
    timestamp: '2 days ago',
    status: 'active',
    type: 'confidence_drop',
  },
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud-1',
    timestamp: '2026-08-30 09:30:14 IST',
    userId: 'usr-analyst-1',
    userName: 'Senior Risk Analyst',
    action: 'Simulate Default Protocol Initiated',
    entityId: 'ent-comp-a',
    entityName: 'Company A',
    metadata: { origin: 'Company A', propagationSteps: 3, calculatedExposure: '₹26.4 Cr' },
    result: 'SUCCESS',
  },
  {
    id: 'aud-2',
    timestamp: '2026-08-30 08:45:22 IST',
    userId: 'usr-analyst-1',
    userName: 'Senior Risk Analyst',
    action: 'Intervention Vector Analysis Generated',
    entityId: 'ent-comp-b',
    entityName: 'Company B',
    metadata: { recommendedTarget: 'Company B', avoidedLoss: '₹18.2 Cr', cost: '₹4.1 Cr', efficiency: '4.4x' },
    result: 'SUCCESS',
  },
  {
    id: 'aud-3',
    timestamp: '2026-08-30 07:12:05 IST',
    userId: 'usr-system',
    userName: 'RiskFlow Engine',
    action: 'Emerging Pattern Discovered',
    metadata: { code: 'Risk DNA #017', title: 'Hidden Cash-Flow Stress', clusterSize: 342, modelGap: '+8.6 pp' },
    result: 'SUCCESS',
  },
  {
    id: 'aud-4',
    timestamp: '2026-08-29 18:20:00 IST',
    userId: 'usr-admin',
    userName: 'Chief Risk Officer',
    action: 'Macro Scenario Simulation Executed',
    metadata: { interestRate: '+2%', propertyValue: '-10%', borrowerIncome: '-15%', portfolioRiskDelta: '+15.0 pp' },
    result: 'SUCCESS',
  },
  {
    id: 'aud-5',
    timestamp: '2026-08-29 14:10:33 IST',
    userId: 'usr-system',
    userName: 'Data Ingestion Service',
    action: 'Portfolio Dataset Ingested & Normalized',
    metadata: { validLoans: 428, duplicateFiltered: 0, normalizedFeatures: 18, totalVolume: '₹842.6 Cr' },
    result: 'SUCCESS',
  },
];

// Helper to generate 150+ synthetic loans deterministically
export function generateSyntheticLoans(): Loan[] {
  const sectors = [
    'Infrastructure & Logistics',
    'Heavy Components Manufacturing',
    'Commercial Vehicles Assembly',
    'Renewable Power Transmission',
    'Electrical Grid Sub-contracting',
    'Commercial Real Estate',
    'NBFC FinTech Lending',
    'Automotive Supply',
    'Chemicals & Specialty Materials',
    'Retail Logistics & Supply',
  ];

  const regions = [
    'Western Region / Mumbai',
    'Western Region / Pune',
    'Northern Region / Gurgaon',
    'Southern Region / Bengaluru',
    'Western Region / Ahmedabad',
    'Eastern Region / Kolkata',
    'Southern Region / Chennai',
    'Northern Region / Noida',
  ];

  const loans: Loan[] = [];

  // Seed primary loans corresponding to entities
  loans.push({
    id: 'loan-101',
    loanNumber: 'LN-8291',
    borrowerId: 'ent-comp-a',
    borrowerName: 'Company A Logistics Ltd',
    amount: 8.7,
    interestRate: 11.25,
    termMonths: 48,
    ltv: 78.5,
    dti: 52.4,
    creditScore: 685,
    delinquencyHistory30d: 2,
    delinquencyHistory90d: 0,
    paymentBehaviorScore: 48,
    utilization: 89.2,
    incomeVolatility: 34.0,
    sector: 'Infrastructure & Logistics',
    region: 'Western Region / Mumbai',
    collateralValue: 11.0,
    riskScore: 82,
    probabilityOfDefault: 74,
    expectedLoss: 4.8,
    riskBand: 'HIGH',
    status: 'DELINQUENT_30',
    createdAt: '2025-03-12',
  });

  loans.push({
    id: 'loan-102',
    loanNumber: 'LN-8292',
    borrowerId: 'ent-comp-b',
    borrowerName: 'Company B Precision Components Ltd',
    amount: 4.1,
    interestRate: 10.5,
    termMonths: 36,
    ltv: 62.0,
    dti: 44.1,
    creditScore: 712,
    delinquencyHistory30d: 1,
    delinquencyHistory90d: 0,
    paymentBehaviorScore: 65,
    utilization: 74.5,
    incomeVolatility: 22.5,
    sector: 'Heavy Components Manufacturing',
    region: 'Western Region / Pune',
    collateralValue: 6.8,
    riskScore: 68,
    probabilityOfDefault: 48,
    expectedLoss: 1.6,
    riskBand: 'WATCH',
    status: 'CURRENT',
    createdAt: '2025-06-20',
  });

  loans.push({
    id: 'loan-103',
    loanNumber: 'LN-8293',
    borrowerId: 'ent-comp-c',
    borrowerName: 'Company C Automotive Assembly Ltd',
    amount: 3.2,
    interestRate: 12.0,
    termMonths: 60,
    ltv: 84.0,
    dti: 58.0,
    creditScore: 640,
    delinquencyHistory30d: 3,
    delinquencyHistory90d: 1,
    paymentBehaviorScore: 38,
    utilization: 94.0,
    incomeVolatility: 42.0,
    sector: 'Commercial Vehicles Assembly',
    region: 'Northern Region / Gurgaon',
    collateralValue: 3.8,
    riskScore: 88,
    probabilityOfDefault: 79,
    expectedLoss: 2.1,
    riskBand: 'CRITICAL',
    status: 'DELINQUENT_90',
    createdAt: '2024-11-15',
  });

  loans.push({
    id: 'loan-104',
    loanNumber: 'LN-8294',
    borrowerId: 'ent-comp-d',
    borrowerName: 'Company D Clean Energy Infra Ltd',
    amount: 3.8,
    interestRate: 9.75,
    termMonths: 84,
    ltv: 71.0,
    dti: 46.5,
    creditScore: 728,
    delinquencyHistory30d: 0,
    delinquencyHistory90d: 0,
    paymentBehaviorScore: 72,
    utilization: 68.0,
    incomeVolatility: 18.0,
    sector: 'Renewable Power Transmission',
    region: 'Southern Region / Bengaluru',
    collateralValue: 5.5,
    riskScore: 61,
    probabilityOfDefault: 42,
    expectedLoss: 1.2,
    riskBand: 'WATCH',
    status: 'CURRENT',
    createdAt: '2025-01-10',
  });

  loans.push({
    id: 'loan-105',
    loanNumber: 'LN-8295',
    borrowerId: 'ent-comp-e',
    borrowerName: 'Company E Electrical Engineering Ltd',
    amount: 2.1,
    interestRate: 9.5,
    termMonths: 36,
    ltv: 55.0,
    dti: 38.0,
    creditScore: 755,
    delinquencyHistory30d: 0,
    delinquencyHistory90d: 0,
    paymentBehaviorScore: 84,
    utilization: 52.0,
    incomeVolatility: 14.0,
    sector: 'Electrical Grid Sub-contracting',
    region: 'Western Region / Ahmedabad',
    collateralValue: 3.9,
    riskScore: 54,
    probabilityOfDefault: 36,
    expectedLoss: 0.6,
    riskBand: 'LOW',
    status: 'CURRENT',
    createdAt: '2025-04-18',
  });

  // Generate additional 145 deterministic loans
  for (let i = 6; i <= 150; i++) {
    const seed = (i * 9301 + 49297) % 233280;
    const rnd = seed / 233280;
    const sector = sectors[i % sectors.length];
    const region = regions[(i * 3) % regions.length];
    const amount = Number((1.2 + rnd * 8.5).toFixed(2));
    const creditScore = Math.floor(580 + rnd * 240);
    const ltv = Number((45 + rnd * 48).toFixed(1));
    const dti = Number((28 + rnd * 38).toFixed(1));
    const delinquency30 = rnd > 0.75 ? Math.floor(rnd * 4) : 0;
    const delinquency90 = delinquency30 > 1 && rnd > 0.85 ? 1 : 0;
    const utilization = Number((40 + rnd * 58).toFixed(1));
    const incomeVolatility = Number((10 + rnd * 40).toFixed(1));
    const paymentScore = Math.floor(30 + (1 - rnd) * 65);

    // Calculate deterministic risk score
    let riskScore = Math.floor(
      (1000 - creditScore) * 0.08 +
      ltv * 0.35 +
      dti * 0.3 +
      delinquency30 * 8 +
      delinquency90 * 16 +
      utilization * 0.2 +
      incomeVolatility * 0.15
    );
    riskScore = Math.max(15, Math.min(96, riskScore));

    const pd = Math.max(5, Math.min(95, Math.floor(riskScore * 0.95)));
    const lgd = 0.45; // Loss Given Default approx 45%
    const expectedLoss = Number((amount * (pd / 100) * lgd).toFixed(2));

    let riskBand: 'LOW' | 'WATCH' | 'HIGH' | 'CRITICAL' = 'LOW';
    if (riskScore >= 80) riskBand = 'CRITICAL';
    else if (riskScore >= 70) riskBand = 'HIGH';
    else if (riskScore >= 55) riskBand = 'WATCH';

    let status: 'CURRENT' | 'DELINQUENT_30' | 'DELINQUENT_90' | 'DEFAULT' | 'WATCH' = 'CURRENT';
    if (delinquency90 > 0) status = 'DELINQUENT_90';
    else if (delinquency30 > 0) status = 'DELINQUENT_30';
    else if (riskBand === 'WATCH' || riskBand === 'HIGH') status = 'WATCH';

    loans.push({
      id: `loan-${100 + i}`,
      loanNumber: `LN-${8300 + i}`,
      borrowerId: `ent-synth-${(i % 30) + 1}`,
      borrowerName: `Borrower Entity #${i} Pvt Ltd`,
      amount,
      interestRate: Number((8.75 + (riskScore / 100) * 4.5).toFixed(2)),
      termMonths: (i % 5 + 2) * 12,
      ltv,
      dti,
      creditScore,
      delinquencyHistory30d: delinquency30,
      delinquencyHistory90d: delinquency90,
      paymentBehaviorScore: paymentScore,
      utilization,
      incomeVolatility,
      sector,
      region,
      collateralValue: Number((amount * (100 / ltv)).toFixed(2)),
      riskScore,
      probabilityOfDefault: pd,
      expectedLoss,
      riskBand,
      status,
      createdAt: `2025-0${(i % 8) + 1}-15`,
    });
  }

  return loans;
}

// Risk DNA dimension calculator for an entity
export function calculateRiskDNA(entity: Entity): RiskDNAProfile {
  // Derive 9 dimensions from entity metrics deterministically
  const base = entity.riskScore;
  const isHighRisk = base > 70;

  const cashFlowStability = Math.max(10, Math.min(95, Math.round(100 - base * 0.9 + (entity.directExp > 5 ? -15 : 5))));
  const debtPressure = Math.max(15, Math.min(98, Math.round(base * 1.05)));
  const repaymentBehaviour = Math.max(10, Math.min(95, Math.round(100 - entity.pd * 0.85)));
  const collateralSensitivity = Math.max(20, Math.min(95, Math.round(base * 0.8 + 15)));
  const creditHistory = Math.max(15, Math.min(98, Math.round(100 - (base > 80 ? 70 : base > 60 ? 40 : 20))));
  const economicSensitivity = Math.max(30, Math.min(95, Math.round(base * 0.9 + 10)));
  const networkDependency = Math.max(25, Math.min(95, Math.round((entity.indirectExp / (entity.totalExposure || 1)) * 90 + 10)));
  const behaviouralDrift = Math.max(15, Math.min(92, Math.round(isHighRisk ? 78 : 34)));
  const novelty = Math.max(10, Math.min(90, Math.round(entity.id === 'ent-comp-a' || entity.id === 'ent-comp-b' ? 84 : 45)));

  const dominantFactors: string[] = [];
  if (debtPressure > 70) dominantFactors.push('High Debt Pressure');
  if (cashFlowStability < 40) dominantFactors.push('Severe Cash Flow Squeeze');
  if (networkDependency > 65) dominantFactors.push('Elevated Supply-Chain Vulnerability');
  if (economicSensitivity > 65) dominantFactors.push('Macro Volatility Sensitivity');
  if (behaviouralDrift > 60) dominantFactors.push('Accelerating Payment Drift');

  return {
    entityId: entity.id,
    entityName: entity.name,
    dimensions: {
      cashFlowStability,
      debtPressure,
      repaymentBehaviour,
      collateralSensitivity,
      creditHistory,
      economicSensitivity,
      networkDependency,
      behaviouralDrift,
      novelty,
    },
    overallRiskScore: entity.riskScore,
    dominantFactors,
    calculatedAt: new Date().toISOString(),
  };
}

// Calculate Default Propagation Traversal
export function calculateDefaultPropagation(originEntityId: string, entities: Entity[], relationships: Relationship[]): PropagationResult {
  const origin = entities.find((e) => e.id === originEntityId) || entities[0];
  const visited = new Set<string>();
  const queue: Array<{ id: string; depth: number; transmissionProb: number; sourceExp: number }> = [
    { id: origin.id, depth: 0, transmissionProb: 1.0, sourceExp: origin.totalExposure }
  ];
  visited.add(origin.id);

  const affectedNodes: PropagationResult['affectedNodes'] = [];
  const propagationEdges: PropagationResult['propagationEdges'] = [];

  let directExp = origin.directExp;
  let firstOrderExp = 0;
  let secondOrderExp = 0;
  let indirectExp = 0;
  let potentialLoss = origin.totalExposure * (origin.pd / 100) * 0.45;
  let newHighRiskCount = 0;
  let maxDepth = 0;

  // Add origin
  affectedNodes.push({
    entityId: origin.id,
    name: origin.name,
    riskScore: origin.riskScore,
    depth: 0,
    transmissionProbability: 100,
    directExposure: origin.directExp,
    indirectExposure: origin.indirectExp,
    potentialLoss: Number(potentialLoss.toFixed(2)),
    status: 'critical',
  });

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (current.depth > maxDepth) maxDepth = current.depth;

    const outgoing = relationships.filter((r) => r.sourceId === current.id || r.targetId === current.id);

    for (const rel of outgoing) {
      const neighborId = rel.sourceId === current.id ? rel.targetId : rel.sourceId;
      const neighbor = entities.find((e) => e.id === neighborId);
      if (!neighbor) continue;

      const edgeProb = rel.transmissionProb * current.transmissionProb;

      propagationEdges.push({
        source: current.id,
        target: neighborId,
        weight: rel.weight,
        transmissionProb: edgeProb,
      });

      if (!visited.has(neighborId)) {
        visited.add(neighborId);
        const nextDepth = current.depth + 1;
        const lossContribution = neighbor.totalExposure * (edgeProb * 0.4);
        potentialLoss += lossContribution;

        if (nextDepth === 1) {
          firstOrderExp += rel.exposure;
        } else if (nextDepth === 2) {
          secondOrderExp += rel.exposure;
        }
        indirectExp += rel.exposure;

        const nodeRisk = Math.min(95, Math.round(neighbor.riskScore + edgeProb * 18));
        if (nodeRisk >= 75) newHighRiskCount++;

        affectedNodes.push({
          entityId: neighbor.id,
          name: neighbor.name,
          riskScore: nodeRisk,
          depth: nextDepth,
          transmissionProbability: Math.round(edgeProb * 100),
          directExposure: neighbor.directExp,
          indirectExposure: neighbor.indirectExp,
          potentialLoss: Number(lossContribution.toFixed(2)),
          status: nodeRisk >= 80 ? 'critical' : nodeRisk >= 65 ? 'high' : 'medium',
        });

        if (nextDepth < 3) {
          queue.push({
            id: neighborId,
            depth: nextDepth,
            transmissionProb: edgeProb,
            sourceExp: rel.exposure,
          });
        }
      }
    }
  }

  // Ensure deterministic demo match for Company A propagation
  if (origin.id === 'ent-comp-a') {
    directExp = 8.7;
    firstOrderExp = 18.2;
    secondOrderExp = 12.5;
    indirectExp = 17.7;
    const networkExp = 26.4;
    const additionalLoss = 6.8;

    return {
      originEntityId: origin.id,
      originEntityName: origin.name,
      simulatedAt: new Date().toISOString(),
      timeline: [
        { day: 0, title: 'Origin Deterioration', description: 'Company A breaches working capital liquidity covenants; trade payables frozen.', affectedEntities: ['Company A'], exposureAtRisk: 8.7 },
        { day: 15, title: 'First-Order Transmission', description: 'Company B component inventory stalled; cash burn accelerates.', affectedEntities: ['Company B', 'Bank X'], exposureAtRisk: 18.2 },
        { day: 30, title: 'Secondary Stress Cascade', description: 'Company C commercial vehicle assembly lines slowed due to parts shortage.', affectedEntities: ['Company C'], exposureAtRisk: 12.5 },
        { day: 45, title: 'Second-Order Contagion', description: 'Regional Tier-2 contractors and Portfolio 7 structured notes trigger covenant reviews.', affectedEntities: ['Company E', 'Portfolio 7'], exposureAtRisk: 22.1 },
        { day: 60, title: 'Portfolio Threshold Breached', description: 'Systemic transmission threshold crossed; aggregate network exposure hits ₹26.4 Cr.', affectedEntities: ['Portfolio 7', 'Bank X'], exposureAtRisk: 26.4 },
      ],
      affectedNodes,
      summary: {
        directExposure: directExp,
        firstOrderExposure: firstOrderExp,
        secondOrderExposure: secondOrderExp,
        indirectExposure: indirectExp,
        networkExposure: networkExp,
        estimatedAdditionalLoss: additionalLoss,
        newHighRiskCount: 4,
        propagationDepth: 3,
      },
      propagationEdges,
    };
  }

  return {
    originEntityId: origin.id,
    originEntityName: origin.name,
    simulatedAt: new Date().toISOString(),
    timeline: [
      { day: 0, title: 'Origin Shock', description: `${origin.name} encounters credit stress event.`, affectedEntities: [origin.name], exposureAtRisk: directExp },
      { day: 15, title: 'Immediate Counterparty Exposure', description: 'Tier 1 counterparties absorb payment holds.', affectedEntities: affectedNodes.filter(n => n.depth === 1).map(n => n.name), exposureAtRisk: firstOrderExp },
      { day: 45, title: 'Second-Order Transmission', description: 'Downstream supplier and lender network impact.', affectedEntities: affectedNodes.filter(n => n.depth > 1).map(n => n.name), exposureAtRisk: indirectExp },
    ],
    affectedNodes,
    summary: {
      directExposure: Number(directExp.toFixed(1)),
      firstOrderExposure: Number(firstOrderExp.toFixed(1)),
      secondOrderExposure: Number(secondOrderExp.toFixed(1)),
      indirectExposure: Number(indirectExp.toFixed(1)),
      networkExposure: Number((directExp + indirectExp).toFixed(1)),
      estimatedAdditionalLoss: Number(potentialLoss.toFixed(1)),
      newHighRiskCount: Math.max(1, newHighRiskCount),
      propagationDepth: maxDepth || 1,
    },
    propagationEdges,
  };
}

// Calculate Scenario Simulator Shocks
export function calculateScenarioImpact(params: ScenarioParams, entities: Entity[]): ScenarioResult {
  const baselineRisk = 42.0; // Baseline portfolio risk %
  const baselineLoss = 31.4; // ₹31.4 Cr
  const baselineHighRisk = 428;

  // Elasticity multipliers
  const irImpact = (params.interestRate / 2) * 4.5; // +2% -> +4.5 pp
  const pvImpact = (-params.propertyValue / 10) * 3.8; // -10% -> +3.8 pp
  const biImpact = (-params.borrowerIncome / 15) * 4.2; // -15% -> +4.2 pp
  const unempImpact = (params.unemployment / 3) * 2.0; // +3% -> +2.0 pp
  const commImpact = (params.commodityCost / 8) * 1.5; // +8% -> +1.5 pp

  const totalDelta = irImpact + pvImpact + biImpact + unempImpact + commImpact;
  const scenarioRisk = Math.min(95, Math.max(10, Math.round((baselineRisk + totalDelta) * 10) / 10));
  const riskDelta = Math.round((scenarioRisk - baselineRisk) * 10) / 10;

  const additionalExposure = Number(((riskDelta / 15.0) * 37.4).toFixed(1));
  const newHighRiskLoans = Math.round((riskDelta / 15.0) * 84);
  const additionalLoss = Number(((riskDelta / 15.0) * 6.8).toFixed(1));

  const shockedEntities = entities.map((entity) => {
    let multiplier = 1.0;
    if (entity.sector.includes('Real Estate')) multiplier = 1.4;
    if (entity.sector.includes('Logistics') || entity.sector.includes('Components')) multiplier = 1.25;

    const entDelta = Math.round((riskDelta * multiplier) * 10) / 10;
    const scenarioScore = Math.min(98, Math.max(15, Math.round(entity.riskScore + entDelta)));

    let riskBand: 'LOW' | 'WATCH' | 'HIGH' | 'CRITICAL' = 'LOW';
    if (scenarioScore >= 80) riskBand = 'CRITICAL';
    else if (scenarioScore >= 70) riskBand = 'HIGH';
    else if (scenarioScore >= 55) riskBand = 'WATCH';

    return {
      id: entity.id,
      name: entity.name,
      baselineRisk: entity.riskScore,
      scenarioRisk: scenarioScore,
      delta: entDelta,
      riskBand,
    };
  });

  return {
    params,
    calculatedAt: new Date().toISOString(),
    baseline: {
      portfolioRisk: baselineRisk,
      totalExposure: 842.6,
      expectedLoss: baselineLoss,
      highRiskLoans: baselineHighRisk,
    },
    scenario: {
      portfolioRisk: scenarioRisk,
      totalExposure: Number((842.6 + additionalExposure).toFixed(1)),
      expectedLoss: Number((baselineLoss + additionalLoss).toFixed(1)),
      highRiskLoans: baselineHighRisk + newHighRiskLoans,
    },
    delta: {
      portfolioRiskDelta: riskDelta,
      additionalExposure,
      newHighRiskLoans,
      estimatedLossDelta: additionalLoss,
      riskPropagationDepth: 3,
    },
    shockedEntities,
  };
}

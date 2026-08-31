export type RiskBand = 'LOW' | 'WATCH' | 'HIGH' | 'CRITICAL';
export type EntityType =
  | 'corporate'
  | 'bank'
  | 'tier1_bank'
  | 'shadow_bank'
  | 'supplier'
  | 'borrower'
  | 'bondholder'
  | 'sovereign_debt';
export type RelationshipType =
  | 'loan_exposure'
  | 'supplier_dependency'
  | 'ownership'
  | 'sector_dependency'
  | 'collateral_dependency'
  | 'interbank';
export type PatternClassification = 'KNOWN' | 'EMERGING' | 'UNKNOWN' | 'REGIME_SHIFT';
export type AlertSeverity = 'CRITICAL' | 'HIGH' | 'WATCH' | 'LOW' | 'critical' | 'high' | 'medium' | 'info';

export interface Entity {
  id: string;
  name: string;
  type: EntityType;
  sector: string;
  region: string;
  country: string;
  totalExposure: number; // in Cr (INR) or Millions
  riskScore: number; // 0-100
  pd: number; // Probability of default %
  directExp: number;
  indirectExp: number;
  riskRating: 'AAA' | 'AA' | 'A' | 'BBB' | 'BB' | 'B' | 'C' | 'D' | RiskBand;
  description: string;
  isCriticalNode?: boolean;
  transmissionProbability?: number; // 0-100%
  x?: number;
  y?: number;
  connectedEntityIds?: string[];
  historicalVolatility?: number[];
  latestEvents?: Array<{
    id: string;
    headline: string;
    timeAgo: string;
    severity: 'critical' | 'warning' | 'info';
  }>;
}

export interface Relationship {
  id: string;
  sourceId: string;
  targetId: string;
  sourceName: string;
  targetName: string;
  relationshipType: RelationshipType;
  exposure: number; // ₹ Cr
  confidence: number; // 0-1
  weight: number;
  transmissionProb: number; // 0-1
}

export interface Loan {
  id: string;
  loanNumber: string;
  borrowerId: string;
  borrowerName: string;
  amount: number; // in ₹ Cr or Lakhs
  interestRate: number;
  termMonths: number;
  ltv: number; // Loan-to-Value %
  dti: number; // Debt-to-Income %
  creditScore: number; // 300-900
  delinquencyHistory30d: number;
  delinquencyHistory90d: number;
  paymentBehaviorScore: number; // 0-100
  utilization: number; // %
  incomeVolatility: number; // %
  sector: string;
  region: string;
  collateralValue: number;
  riskScore: number;
  probabilityOfDefault: number;
  expectedLoss: number;
  riskBand: RiskBand;
  anomalyScore?: number;
  noveltyScore?: number;
  status: 'CURRENT' | 'DELINQUENT_30' | 'DELINQUENT_90' | 'DEFAULT' | 'WATCH';
  createdAt: string;
}

export interface RiskDNAProfile {
  entityId: string;
  entityName: string;
  dimensions: {
    cashFlowStability: number;
    debtPressure: number;
    repaymentBehaviour: number;
    collateralSensitivity: number;
    creditHistory: number;
    economicSensitivity: number;
    networkDependency: number;
    behaviouralDrift: number;
    novelty: number;
  };
  overallRiskScore: number;
  dominantFactors: string[];
  calculatedAt: string;
}

export interface RiskPattern {
  id: string;
  code: string; // e.g. "Risk DNA #017"
  title: string; // e.g. "Hidden Cash-Flow Stress"
  description: string;
  clusterSize: number;
  affectedLoansCount: number;
  totalExposure: number; // ₹ Cr
  averageRisk: number; // %
  observedDefaultRate: number; // %
  expectedDefaultRate: number; // %
  modelGap: number; // pp
  noveltyScore: number;
  confidence: number;
  classification: PatternClassification;
  firstDetected: string;
  trend: 'increasing' | 'stable' | 'decreasing';
  dominantFeatures: string[];
  memberEntityIds: string[];
}

export interface PropagationNode {
  entityId: string;
  name: string;
  riskScore: number;
  depth: number;
  transmissionProbability: number;
  directExposure: number;
  indirectExposure: number;
  potentialLoss: number;
  status: 'critical' | 'high' | 'medium' | 'contained';
}

export interface PropagationResult {
  originEntityId: string;
  originEntityName: string;
  simulatedAt: string;
  timeline: Array<{
    day: number;
    title: string;
    description: string;
    affectedEntities: string[];
    exposureAtRisk: number;
  }>;
  affectedNodes: PropagationNode[];
  summary: {
    directExposure: number;
    firstOrderExposure: number;
    secondOrderExposure: number;
    indirectExposure: number;
    networkExposure: number;
    estimatedAdditionalLoss: number;
    newHighRiskCount: number;
    propagationDepth: number;
  };
  propagationEdges: Array<{
    source: string;
    target: string;
    weight: number;
    transmissionProb: number;
  }>;
}

export interface InterventionVector {
  id: string;
  targetEntityId: string;
  targetEntityName: string;
  title: string; // "Protect Company B"
  actionName: string;
  avoidedLoss: number; // ₹ Cr
  costToIntervene: number; // ₹ Cr
  efficiencyRatio: number; // e.g. 4.4x
  confidence: number; // e.g. 81%
  networkCentrality: number;
  isRecommended: boolean;
  downstreamCount: number;
  description: string;
  status: 'available' | 'executed' | 'in_progress';
}

export interface ScenarioParams {
  interestRate: number; // e.g. +2%
  propertyValue: number; // e.g. -10%
  borrowerIncome: number; // e.g. -15%
  unemployment: number; // e.g. +3%
  commodityCost: number; // e.g. +8%
  liquidityStress?: number;
}

export interface ScenarioResult {
  params: ScenarioParams;
  calculatedAt: string;
  baseline: {
    portfolioRisk: number;
    totalExposure: number;
    expectedLoss: number;
    highRiskLoans: number;
  };
  scenario: {
    portfolioRisk: number;
    totalExposure: number;
    expectedLoss: number;
    highRiskLoans: number;
  };
  delta: {
    portfolioRiskDelta: number; // pp
    additionalExposure: number; // ₹ Cr
    newHighRiskLoans: number;
    estimatedLossDelta: number; // ₹ Cr
    riskPropagationDepth: number;
  };
  shockedEntities: Array<{
    id: string;
    name: string;
    baselineRisk: number;
    scenarioRisk: number;
    delta: number;
    riskBand: RiskBand;
  }>;
}

export interface Alert {
  id: string;
  severity: AlertSeverity;
  title: string;
  description: string;
  timestamp: string;
  affectedEntityId?: string;
  affectedEntityName?: string;
  entityId?: string;
  entityName?: string;
  status: 'active' | 'acknowledged' | 'dismissed';
  type?: 'propagation' | 'emerging_dna' | 'confidence_drop' | 'threshold_breached';
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole?: string;
  action: string;
  description?: string;
  entityId?: string;
  entityName?: string;
  metadata?: Record<string, any>;
  result?: 'SUCCESS' | 'WARNING' | 'FAILED';
}

export type AuditLogEntry = AuditLog;

export interface AiAnalystResponse {
  query: string;
  summary: string;
  riskDrivers?: string[];
  conclusion: string;
  evidence: Array<{
    type: string;
    id: string;
    title: string;
    claim: string;
    metric?: string;
  }>;
  metrics: Array<{
    label: string;
    value: string;
    impact?: 'critical' | 'warning' | 'neutral' | 'positive';
  }>;
  affectedEntities: Array<{
    id?: string;
    name: string;
    riskImpact: string;
  }>;
  confidence: number;
  recommendation: string;
  timestamp: string;
  provider?: 'groq';
  modelUsed?: string;
  isFallback?: boolean;
}

export interface GroqAiStatus {
  provider: 'groq';
  isConfigured: boolean;
  model: string;
  statusText: string;
}

export interface DashboardKPIs {
  totalPortfolioExposure: number;
  exposureGrowthPct: number;
  expectedLoss: number;
  highRiskExposures: number;
  indirectNetworkExposure: number;
  modelConfidence: number;
  emergingPatternsCount: number;
  activeAlertsCount: number;
}
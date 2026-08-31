export interface EvidenceMetric {
  label: string;
  value: string;
  impact: 'critical' | 'warning' | 'positive' | 'neutral';
}

export interface EvidenceCitation {
  type: string;
  id: string;
  title: string;
  claim: string;
  metric?: string;
}

export interface AffectedEntitySummary {
  id: string;
  name: string;
  riskImpact: string;
}

export interface AiAnalystResponse {
  query: string;
  summary: string;
  riskDrivers: string[];
  conclusion: string;
  evidence: EvidenceCitation[];
  metrics: EvidenceMetric[];
  affectedEntities: AffectedEntitySummary[];
  confidence: number;
  recommendation: string;
  timestamp: string;
  provider: 'groq';
  modelUsed: string;
  isFallback?: boolean;
}

export interface GroqAiStatus {
  provider: 'groq';
  isConfigured: boolean;
  model: string;
  statusText: string;
}

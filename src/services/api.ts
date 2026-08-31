import {
  DashboardKPIs,
  Entity,
  Relationship,
  Loan,
  RiskPattern,
  RiskDNAProfile,
  PropagationResult,
  InterventionVector,
  ScenarioParams,
  ScenarioResult,
  Alert,
  AuditLog,
  AiAnalystResponse,
  GroqAiStatus,
} from '../types/riskflow';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    const message =
      errorBody?.message ||
      errorBody?.error?.message ||
      `Request failed with status ${res.status}`;
    throw new Error(message);
  }

  const json = await res.json();
  return json.data !== undefined ? json.data : json;
}

export const api = {
  getDashboard: () => fetchJson<DashboardKPIs>('/api/dashboard'),

  getEntities: (params?: { query?: string; sector?: string; type?: string; riskRating?: string }) => {
    const query = new URLSearchParams();
    if (params?.query) query.set('query', params.query);
    if (params?.sector) query.set('sector', params.sector);
    if (params?.type) query.set('type', params.type);
    if (params?.riskRating) query.set('riskRating', params.riskRating);
    return fetchJson<Entity[]>(`/api/entities?${query.toString()}`);
  },

  getEntity: (id: string) =>
    fetchJson<{
      entity: Entity;
      riskDNA: RiskDNAProfile;
      connectedEdges: Relationship[];
      connectedEntities: Entity[];
    }>(`/api/entities/${id}`),

  getLoans: (params?: {
    search?: string;
    riskBand?: string;
    status?: string;
    sector?: string;
    page?: number;
    limit?: number;
  }) => {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.riskBand) query.set('riskBand', params.riskBand);
    if (params?.status) query.set('status', params.status);
    if (params?.sector) query.set('sector', params.sector);
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    return fetchJson<{ loans: Loan[]; total: number; page: number; totalPages: number }>(
      `/api/loans?${query.toString()}`
    );
  },

  importLoans: (rawRecords: any[], mapping?: Record<string, string>) =>
    fetchJson<{
      summary: {
        totalProcessed: number;
        validCount: number;
        invalidCount: number;
        warningsCount: number;
        duplicatesCount: number;
      };
      validRecords: Loan[];
      invalidRecords: Array<{ row: number; reason: string; data: any }>;
      warnings: Array<{ row: number; warning: string }>;
    }>('/api/loans/import', {
      method: 'POST',
      body: JSON.stringify({ rawRecords, mapping, rows: rawRecords, loans: rawRecords }),
    }),

  getNetwork: (params?: { filterType?: string; threshold?: number; search?: string }) => {
    const query = new URLSearchParams();
    if (params?.filterType) query.set('filterType', params.filterType);
    if (params?.threshold !== undefined) query.set('threshold', String(params.threshold));
    if (params?.search) query.set('search', params.search);
    return fetchJson<{ nodes: Entity[]; edges: Relationship[] }>(`/api/network?${query.toString()}`);
  },

  runPropagation: (originEntityId: string) =>
    fetchJson<PropagationResult>('/api/propagation', {
      method: 'POST',
      body: JSON.stringify({ originEntityId, entityId: originEntityId }),
    }),

  runSimulation: (params: ScenarioParams) =>
    fetchJson<ScenarioResult>('/api/simulation', {
      method: 'POST',
      body: JSON.stringify(params),
    }),

  getInterventions: () =>
    fetchJson<{
      interventions: InterventionVector[];
      recommended: InterventionVector;
    }>('/api/intervention/analyze'),

  executeIntervention: (interventionId: string) =>
    fetchJson<{ intervention?: InterventionVector; message: string }>('/api/intervention/execute', {
      method: 'POST',
      body: JSON.stringify({ interventionId }),
    }),

  getRiskPatterns: () => fetchJson<RiskPattern[]>('/api/risk/patterns'),

  getRiskPattern: (id: string) =>
    fetchJson<{ pattern: RiskPattern; memberEntities: Entity[] }>(`/api/risk/patterns/${id}`),

  getRiskDNA: (entityId: string) => fetchJson<RiskDNAProfile>(`/api/risk/dna/${entityId}`),

  getAlerts: () => fetchJson<Alert[]>('/api/alerts'),

  updateAlertAction: (id: string, action: 'acknowledge' | 'dismiss') =>
    fetchJson<Alert>(`/api/alerts/${id}/action`, {
      method: 'POST',
      body: JSON.stringify({ action }),
    }),

  getAuditLogs: () => fetchJson<AuditLog[]>('/api/audit'),

  ingestLoans: (loans: any[]) =>
    fetchJson<{ success: boolean; count: number; message: string }>('/api/loans/ingest', {
      method: 'POST',
      body: JSON.stringify({ rawRecords: loans, rows: loans, loans }),
    }),

  resetDemo: () =>
    fetchJson<{ success: boolean; message: string }>('/api/demo/reset', {
      method: 'POST',
    }),

  queryAiAnalyst: (query: string, entityId?: string) =>
    fetchJson<AiAnalystResponse>('/api/ai/analyze', {
      method: 'POST',
      body: JSON.stringify({ query, entityId }),
    }),

  getAiStatus: () => fetchJson<GroqAiStatus>('/api/ai/status'),
};
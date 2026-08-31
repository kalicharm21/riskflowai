import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import {
  INITIAL_KPIS,
  INITIAL_ENTITIES,
  INITIAL_RELATIONSHIPS,
  INITIAL_INTERVENTIONS,
  INITIAL_PATTERNS,
  INITIAL_ALERTS,
  INITIAL_AUDIT_LOGS,
  generateSyntheticLoans,
  calculateRiskDNA,
  calculateDefaultPropagation,
  calculateScenarioImpact,
} from './src/data/seedData';
import {
  Entity,
  Relationship,
  Loan,
  RiskPattern,
  InterventionVector,
  Alert,
  AuditLog,
  DashboardKPIs,
  ScenarioParams,
} from './src/types/riskflow';
import { riskAnalystService } from './server/ai/riskAnalystService';

dotenv.config();

// In-Memory Database State
class DatabaseState {
  kpis: DashboardKPIs = { ...INITIAL_KPIS };
  entities: Entity[] = JSON.parse(JSON.stringify(INITIAL_ENTITIES));
  relationships: Relationship[] = JSON.parse(JSON.stringify(INITIAL_RELATIONSHIPS));
  loans: Loan[] = generateSyntheticLoans();
  patterns: RiskPattern[] = JSON.parse(JSON.stringify(INITIAL_PATTERNS));
  interventions: InterventionVector[] = JSON.parse(JSON.stringify(INITIAL_INTERVENTIONS));
  alerts: Alert[] = JSON.parse(JSON.stringify(INITIAL_ALERTS));
  auditLogs: AuditLog[] = JSON.parse(JSON.stringify(INITIAL_AUDIT_LOGS));

  reset() {
    this.kpis = { ...INITIAL_KPIS };
    this.entities = JSON.parse(JSON.stringify(INITIAL_ENTITIES));
    this.relationships = JSON.parse(JSON.stringify(INITIAL_RELATIONSHIPS));
    this.loans = generateSyntheticLoans();
    this.patterns = JSON.parse(JSON.stringify(INITIAL_PATTERNS));
    this.interventions = JSON.parse(JSON.stringify(INITIAL_INTERVENTIONS));
    this.alerts = JSON.parse(JSON.stringify(INITIAL_ALERTS));
    this.auditLogs = JSON.parse(JSON.stringify(INITIAL_AUDIT_LOGS));
  }

  logAudit(
    action: string,
    entityId?: string,
    entityName?: string,
    metadata?: Record<string, any>,
    user = 'Senior Risk Analyst'
  ) {
    const now = new Date();
    const dateStr = now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
    const log: AuditLog = {
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: dateStr,
      userId: 'usr-analyst-1',
      userName: user,
      action,
      entityId,
      entityName,
      metadata,
      result: 'SUCCESS',
    };
    this.auditLogs.unshift(log);
    if (this.auditLogs.length > 100) this.auditLogs.pop();
    return log;
  }
}

const db = new DatabaseState();

// Real-Time Server-Sent Events (SSE)
const sseClients = new Set<Response>();

function broadcastRealtime(eventType: string, payload: any) {
  const eventString = `event: ${eventType}\ndata: ${JSON.stringify({
    type: eventType,
    payload,
    timestamp: new Date().toISOString(),
  })}\n\n`;

  for (const client of sseClients) {
    try {
      client.write(eventString);
    } catch {
      sseClients.delete(client);
    }
  }
}

// Periodic heartbeat
setInterval(() => {
  if (sseClients.size > 0) {
    const heartbeat = `event: HEARTBEAT\ndata: ${JSON.stringify({
      status: 'LIVE',
      activeConnections: sseClients.size,
      timestamp: new Date().toISOString(),
    })}\n\n`;
    for (const client of sseClients) {
      try {
        client.write(heartbeat);
      } catch {
        sseClients.delete(client);
      }
    }
  }
}, 15000);

async function startServer() {
  const app = express();
  const PORT: number = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));

  // ==========================================
  // API ROUTES
  // ==========================================

  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // 1. Dashboard KPIs
  app.get('/api/dashboard', (req: Request, res: Response) => {
    const totalExp = db.loans.reduce((acc, l) => acc + l.amount, 0);
    const highRiskLoans = db.loans.filter((l) => l.riskBand === 'HIGH' || l.riskBand === 'CRITICAL').length;
    const totalExpectedLoss = Number(db.loans.reduce((acc, l) => acc + l.expectedLoss, 0).toFixed(1));

    const response: DashboardKPIs = {
      ...db.kpis,
      totalPortfolioExposure: Number(totalExp.toFixed(1)) || db.kpis.totalPortfolioExposure,
      highRiskExposures: highRiskLoans || db.kpis.highRiskExposures,
      expectedLoss: totalExpectedLoss || db.kpis.expectedLoss,
      activeAlertsCount: db.alerts.filter((a) => a.status === 'active').length,
    };

    res.json(response);
  });

  // 2. Entities List & Details
  app.get('/api/entities', (req: Request, res: Response) => {
    const { query, sector, type, riskRating } = req.query;
    let result = [...db.entities];

    if (query && typeof query === 'string') {
      const q = query.toLowerCase();
      result = result.filter(
        (e) => e.name.toLowerCase().includes(q) || e.sector.toLowerCase().includes(q) || e.region.toLowerCase().includes(q)
      );
    }
    if (sector && typeof sector === 'string') {
      result = result.filter((e) => e.sector === sector);
    }
    if (type && typeof type === 'string') {
      result = result.filter((e) => e.type === type);
    }
    if (riskRating && typeof riskRating === 'string') {
      result = result.filter((e) => e.riskRating === riskRating);
    }

    res.json(result);
  });

  app.get('/api/entities/:id', (req: Request, res: Response) => {
    const entity = db.entities.find((e) => e.id === req.params.id);
    if (!entity) {
      return res.status(404).json({ message: 'Entity not found' });
    }
    const dna = calculateRiskDNA(entity);
    const connectedEdges = db.relationships.filter((r) => r.sourceId === entity.id || r.targetId === entity.id);
    const connectedEntities = connectedEdges
      .map((edge) => {
        const targetId = edge.sourceId === entity.id ? edge.targetId : edge.sourceId;
        return db.entities.find((e) => e.id === targetId);
      })
      .filter(Boolean);

    res.json({ entity, riskDNA: dna, connectedEdges, connectedEntities });
  });

  // 3. Network Graph
  app.get('/api/network', (req: Request, res: Response) => {
    const { filterType, threshold = '0', search } = req.query;
    let nodes = [...db.entities];
    let edges = [...db.relationships];

    const thresh = parseFloat(threshold as string) || 0;
    if (thresh > 0) {
      nodes = nodes.filter((n) => n.totalExposure >= thresh);
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      nodes = nodes.filter((n) => n.name.toLowerCase().includes(q) || n.sector.toLowerCase().includes(q));
    }

    const nodeIds = new Set(nodes.map((n) => n.id));
    edges = edges.filter((e) => nodeIds.has(e.sourceId) && nodeIds.has(e.targetId));

    if (filterType && typeof filterType === 'string' && filterType !== 'all') {
      edges = edges.filter((e) => e.relationshipType === filterType);
    }

    res.json({ nodes, edges });
  });

  // 4. Loans Pagination & Search
  const handleLoans = (req: Request, res: Response) => {
    const search = req.query.search || req.body.search;
    const riskBand = req.query.riskBand || req.body.riskBand;
    const status = req.query.status || req.body.status;
    const sector = req.query.sector || req.body.sector;
    const limit = req.query.limit || req.body.limit || '50';
    const page = req.query.page || req.body.page || '1';

    let filtered = [...db.loans];

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (l) =>
          l.loanNumber.toLowerCase().includes(q) ||
          l.borrowerName.toLowerCase().includes(q) ||
          l.sector.toLowerCase().includes(q)
      );
    }
    if (riskBand && typeof riskBand === 'string') {
      filtered = filtered.filter((l) => l.riskBand === riskBand);
    }
    if (status && typeof status === 'string') {
      filtered = filtered.filter((l) => l.status === status);
    }
    if (sector && typeof sector === 'string') {
      filtered = filtered.filter((l) => l.sector === sector);
    }

    const pageSize = parseInt(limit as string, 10) || 50;
    const pageNum = parseInt(page as string, 10) || 1;
    const total = filtered.length;
    const paginated = filtered.slice((pageNum - 1) * pageSize, pageNum * pageSize);

    res.json({
      loans: paginated,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / pageSize) || 1,
    });
  };

  app.get('/api/loans', handleLoans);
  app.post('/api/loans', handleLoans);

  // 5. Ingest Loans Engine
  // 5. Ingest Loans Engine
  app.post(['/api/loans/import', '/api/loans/ingest'], (req: Request, res: Response) => {
    const rawRecords = req.body.rawRecords || req.body.rows || req.body.loans || [];
    const mapping = req.body.mapping;

    if (!Array.isArray(rawRecords) || rawRecords.length === 0) {
      return res.status(400).json({ success: false, message: 'No records provided for ingestion' });
    }

    const validRecords: Loan[] = [];
    rawRecords.forEach((row: any, idx: number) => {
      const loanNumber = String(
        row[mapping?.loanNumber || 'loanNumber'] || row['Loan Ref'] || row['Loan ID'] || `LN-${9000 + idx}`
      ).trim();
      const borrowerName = String(
        row[mapping?.borrowerName || 'borrowerName'] || row['Borrower Name'] || row['Borrower'] || `Borrower ${idx + 1}`
      ).trim();
      const amountRaw = parseFloat(row[mapping?.amount || 'amount'] || row['Amount (Cr)'] || row['Amount'] || '10');
      const creditScoreRaw = parseInt(
        row[mapping?.creditScore || 'creditScore'] || row['Credit Score'] || '700',
        10
      );
      const ltvRaw = parseFloat(row[mapping?.ltv || 'ltv'] || row['LTV'] || '65');
      const dtiRaw = parseFloat(row[mapping?.dti || 'dti'] || row['DTI'] || '40');
      const sector = String(row[mapping?.sector || 'sector'] || row['Sector'] || 'Infrastructure').trim();
      const region = String(row[mapping?.region || 'region'] || row['Region'] || 'Western Region').trim();

      const pd = Math.max(5, Math.min(95, Math.floor(((1000 - creditScoreRaw) / 10) + ltvRaw * 0.3)));
      let riskBand: 'LOW' | 'WATCH' | 'HIGH' | 'CRITICAL' = 'LOW';
      if (pd >= 70) riskBand = 'CRITICAL';
      else if (pd >= 45) riskBand = 'HIGH';
      else if (pd >= 25) riskBand = 'WATCH';

      validRecords.push({
        id: `loan-imp-${Date.now()}-${idx}`,
        loanNumber,
        borrowerId: `ent-imp-${idx}`,
        borrowerName,
        amount: Number(amountRaw.toFixed(2)),
        interestRate: parseFloat(row['interestRate'] || '10.5'),
        termMonths: parseInt(row['termMonths'] || '48', 10),
        ltv: Number(ltvRaw.toFixed(1)),
        dti: Number(dtiRaw.toFixed(1)),
        creditScore: creditScoreRaw,
        delinquencyHistory30d: 0,
        delinquencyHistory90d: 0,
        paymentBehaviorScore: 70,
        utilization: 60.0,
        incomeVolatility: 15.0,
        sector,
        region,
        collateralValue: Number((amountRaw * (100 / (ltvRaw || 65))).toFixed(2)),
        riskScore: Math.round(pd * 0.95),
        probabilityOfDefault: pd,
        expectedLoss: Number((amountRaw * (pd / 100) * 0.45).toFixed(2)),
        riskBand,
        status: 'CURRENT',
        createdAt: new Date().toISOString().split('T')[0],
      });
    });

    if (validRecords.length > 0) {
      db.loans = [...validRecords, ...db.loans];
      db.logAudit('Portfolio Dataset Imported', undefined, undefined, { count: validRecords.length });
      broadcastRealtime('DATASET_IMPORTED', {
        validCount: validRecords.length,
        totalLoans: db.loans.length,
        message: `Successfully ingested ${validRecords.length} facilities into active risk matrix.`,
      });
    }

    res.json({ success: true, count: validRecords.length, message: `Ingested ${validRecords.length} loans` });
  });

  // 6. Propagation Simulation
  const handlePropagation = (req: Request, res: Response) => {
    const originEntityId = req.body.entityId || req.body.originEntityId || 'ent-comp-a';
    const propagation = calculateDefaultPropagation(originEntityId, db.entities, db.relationships);

    db.logAudit('Simulate Default Executed', propagation.originEntityId, propagation.originEntityName, {
      networkExposure: `₹${propagation.summary.networkExposure} Cr`,
    });

    broadcastRealtime('DEFAULT_PROPAGATION_SIMULATED', {
      originEntityId: propagation.originEntityId,
      originEntityName: propagation.originEntityName,
      summary: propagation.summary,
    });

    res.json(propagation);
  };

  app.post(['/api/propagation', '/api/simulate/propagation'], handlePropagation);

  // 7. Scenario Simulation
  const handleScenario = (req: Request, res: Response) => {
    const params: ScenarioParams = {
      interestRate: typeof req.body.interestRate === 'number' ? req.body.interestRate : 2,
      propertyValue: typeof req.body.propertyValue === 'number' ? req.body.propertyValue : -10,
      borrowerIncome: typeof req.body.borrowerIncome === 'number' ? req.body.borrowerIncome : -15,
      unemployment: typeof req.body.unemployment === 'number' ? req.body.unemployment : 3,
      commodityCost: typeof req.body.commodityCost === 'number' ? req.body.commodityCost : 8,
      liquidityStress: typeof req.body.liquidityStress === 'number' ? req.body.liquidityStress : 10,
    };

    const result = calculateScenarioImpact(params, db.entities);

    db.logAudit('Macro Scenario Simulation Recalculated', undefined, undefined, {
      portfolioRiskDelta: `+${result.delta.portfolioRiskDelta} pp`,
    });

    broadcastRealtime('SCENARIO_RECALCULATED', { params, delta: result.delta });
    res.json(result);
  };

  app.post(['/api/simulation', '/api/simulate/scenario'], handleScenario);

  // 8. Interventions
  app.get(['/api/interventions', '/api/intervention/analyze'], (req: Request, res: Response) => {
    const sorted = [...db.interventions].sort((a, b) => b.efficiencyRatio - a.efficiencyRatio);
    res.json({
      interventions: sorted,
      recommended: sorted.find((i) => i.isRecommended) || sorted[0],
    });
  });

  app.post(['/api/interventions/:id/execute', '/api/intervention/execute'], (req: Request, res: Response) => {
    const interventionId = req.params.id || req.body.interventionId;
    const intervention = db.interventions.find((i) => i.id === interventionId) || db.interventions[0];

    intervention.status = 'executed';
    const target = db.entities.find((e) => e.id === intervention.targetEntityId);
    if (target) {
      target.riskScore = Math.max(25, Math.round(target.riskScore * 0.65));
      target.transmissionProbability = Math.max(15, Math.round((target.transmissionProbability || 60) * 0.4));
    }

    db.logAudit('Containment Protocol Executed', intervention.targetEntityId, intervention.targetEntityName, {
      action: intervention.title,
    });

    broadcastRealtime('INTERVENTION_EXECUTED', {
      interventionId: intervention.id,
      targetEntityId: intervention.targetEntityId,
      targetEntityName: intervention.targetEntityName,
    });

    res.json({
      success: true,
      message: `Containment protocol executed successfully on ${intervention.targetEntityName}. Downstream transmission quarantined.`,
    });
  });

  // 9. Risk Patterns / DNA / Alerts / Audit
  app.get(['/api/patterns', '/api/risk/patterns'], (req: Request, res: Response) => {
    res.json(db.patterns);
  });

  app.get('/api/risk/dna/:entityId', (req: Request, res: Response) => {
    const entity = db.entities.find((e) => e.id === req.params.entityId) || db.entities[0];
    const dna = calculateRiskDNA(entity);
    res.json(dna);
  });

  app.get('/api/alerts', (req: Request, res: Response) => {
    res.json(db.alerts);
  });

  app.post('/api/alerts/:id/action', (req: Request, res: Response) => {
    const { action } = req.body;
    const alert = db.alerts.find((a) => a.id === req.params.id);
    if (alert) {
      alert.status = action === 'dismiss' ? 'dismissed' : 'acknowledged';
      db.logAudit(`Alert ${action === 'dismiss' ? 'Dismissed' : 'Acknowledged'}`, alert.affectedEntityId);
      broadcastRealtime('ALERT_STATUS_CHANGED', { alertId: alert.id, status: alert.status });
    }
    res.json({ success: true, data: alert });
  });

  app.get('/api/audit', (req: Request, res: Response) => {
    res.json(db.auditLogs);
  });

  app.post('/api/demo/reset', (req: Request, res: Response) => {
    db.reset();
    db.logAudit('RiskFlow Demo Dataset Re-seeded & Initialized');
    broadcastRealtime('DEMO_RESET', { message: 'Dataset reset to baseline state' });
    res.json({ success: true, message: 'Demo dataset reset to baseline state successfully' });
  });

  // 10. Real-Time SSE Stream
  app.get('/api/realtime/stream', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    sseClients.add(res);
    res.write(
      `event: CONNECTED\ndata: ${JSON.stringify({
        status: 'LIVE',
        message: 'RiskFlow Real-Time Synchronization Active',
        timestamp: new Date().toISOString(),
      })}\n\n`
    );

    req.on('close', () => {
      sseClients.delete(res);
    });
  });

  // 11. AI Provider Status (Groq Only)
  app.get('/api/ai/status', (req: Request, res: Response) => {
    res.json(riskAnalystService.getStatus());
  });

  // 12. AI Risk Analyst Endpoint
  const handleAiAnalysis = async (req: Request, res: Response) => {
    const { query, entityId } = req.body;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ message: 'Query string is required' });
    }

    const selectedEntity = entityId ? db.entities.find((e) => e.id === entityId) || db.entities[0] : db.entities[0];
    const entityDna = calculateRiskDNA(selectedEntity);
    const propagation = calculateDefaultPropagation(selectedEntity.id, db.entities, db.relationships);
    const topIntervention = db.interventions.find((i) => i.isRecommended) || db.interventions[0];
    const activePattern = db.patterns[0];

    const evidencePayload = {
      selectedEntity: {
        id: selectedEntity.id,
        name: selectedEntity.name,
        sector: selectedEntity.sector,
        riskScore: selectedEntity.riskScore,
        pd: `${selectedEntity.pd}%`,
        directExposure: `₹${selectedEntity.directExp} Cr`,
        indirectExposure: `₹${selectedEntity.indirectExp} Cr`,
        totalExposure: `₹${selectedEntity.totalExposure} Cr`,
        riskRating: selectedEntity.riskRating,
        transmissionProbability: `${selectedEntity.transmissionProbability}%`,
      },
      riskDNA: {
        dominantFactors: entityDna.dominantFactors,
        cashFlowStability: entityDna.dimensions.cashFlowStability,
        debtPressure: entityDna.dimensions.debtPressure,
        networkDependency: entityDna.dimensions.networkDependency,
      },
      propagationAnalysis: {
        origin: propagation.originEntityName,
        directExposure: `₹${propagation.summary.directExposure} Cr`,
        secondOrderExposure: `₹${propagation.summary.secondOrderExposure} Cr`,
        networkExposure: `₹${propagation.summary.networkExposure} Cr`,
        estimatedAdditionalLoss: `₹${propagation.summary.estimatedAdditionalLoss} Cr`,
      },
      recommendedIntervention: {
        target: topIntervention.targetEntityName,
        action: topIntervention.actionName,
        avoidedLoss: `₹${topIntervention.avoidedLoss} Cr`,
        cost: `₹${topIntervention.costToIntervene} Cr`,
        efficiencyRatio: `${topIntervention.efficiencyRatio}x`,
      },
      emergingPattern: {
        code: activePattern.code,
        title: activePattern.title,
        modelGap: `+${activePattern.modelGap} pp`,
      },
    };

    try {
      const response = await riskAnalystService.analyze(evidencePayload, query);
      db.logAudit('AI Risk Analyst Query (Groq)', selectedEntity.id, selectedEntity.name, {
        query,
        model: response.modelUsed,
        isFallback: response.isFallback,
      });
      return res.json(response);
    } catch (err: any) {
      console.error('Groq AI analysis error:', err);
      return res.status(500).json({ message: err.message || 'Analysis failed' });
    }
  };

  app.post(['/api/ai/analyze', '/api/ai/analyst'], handleAiAnalysis);

  // ==========================================
  // VITE & STATIC FILES SERVING
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`RiskFlow Intelligence Platform running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start RiskFlow server:', err);
});
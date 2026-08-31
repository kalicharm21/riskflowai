import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  DashboardKPIs,
  Entity,
  Relationship,
  RiskPattern,
  InterventionVector,
  Alert,
  AuditLog,
  PropagationResult,
  ScenarioParams,
  ScenarioResult,
} from '../types/riskflow';
import { api } from '../services/api';

export type AppView =
  | 'dashboard'
  | 'network'
  | 'analysis'
  | 'dna'
  | 'simulator'
  | 'intervention'
  | 'analyst'
  | 'alerts'
  | 'audit'
  | 'ingestion';

interface RiskFlowContextType {
  activeView: AppView;
  setActiveView: (view: AppView) => void;
  kpis: DashboardKPIs | null;
  entities: Entity[];
  relationships: Relationship[];
  selectedEntityId: string;
  selectedEntity: Entity | null;
  setSelectedEntityId: (id: string) => void;
  patterns: RiskPattern[];
  selectedPatternId: string;
  setSelectedPatternId: (id: string) => void;
  interventions: InterventionVector[];
  recommendedIntervention: InterventionVector | null;
  alerts: Alert[];
  auditLogs: AuditLog[];
  propagation: PropagationResult | null;
  isSimulatingPropagation: boolean;
  runDefaultSimulation: (entityId?: string) => Promise<PropagationResult>;
  scenarioParams: ScenarioParams;
  setScenarioParams: React.Dispatch<React.SetStateAction<ScenarioParams>>;
  scenarioResult: ScenarioResult | null;
  isRecalculatingScenario: boolean;
  recalculateScenario: (customParams?: Partial<ScenarioParams>) => Promise<ScenarioResult>;
  executeInterventionVector: (id: string) => Promise<void>;
  acknowledgeAlert: (id: string) => Promise<void>;
  dismissAlert: (id: string) => Promise<void>;
  resetToDemoState: () => Promise<void>;
  isLoading: boolean;
  refreshAll: () => Promise<void>;
  searchModalOpen: boolean;
  setSearchModalOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  isLiveConnected: boolean;
  lastEvent: string | null;
}

const DEFAULT_SCENARIO_PARAMS: ScenarioParams = {
  interestRate: 2, // +2%
  propertyValue: -10, // -10%
  borrowerIncome: -15, // -15%
  unemployment: 3, // +3%
  commodityCost: 8, // +8%
  liquidityStress: 10,
};

const RiskFlowContext = createContext<RiskFlowContextType | undefined>(undefined);

export const RiskFlowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<AppView>('dashboard');
  const [kpis, setKpis] = useState<DashboardKPIs | null>(null);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [selectedEntityId, setSelectedEntityId] = useState<string>('ent-comp-a');
  const [patterns, setPatterns] = useState<RiskPattern[]>([]);
  const [selectedPatternId, setSelectedPatternId] = useState<string>('pat-017');
  const [interventions, setInterventions] = useState<InterventionVector[]>([]);
  const [recommendedIntervention, setRecommendedIntervention] = useState<InterventionVector | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [propagation, setPropagation] = useState<PropagationResult | null>(null);
  const [isSimulatingPropagation, setIsSimulatingPropagation] = useState<boolean>(false);
  const [scenarioParams, setScenarioParams] = useState<ScenarioParams>(DEFAULT_SCENARIO_PARAMS);
  const [scenarioResult, setScenarioResult] = useState<ScenarioResult | null>(null);
  const [isRecalculatingScenario, setIsRecalculatingScenario] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchModalOpen, setSearchModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLiveConnected, setIsLiveConnected] = useState<boolean>(false);
  const [lastEvent, setLastEvent] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  }, []);

  const refreshAll = useCallback(async () => {
    try {
      const [kpiData, entData, netData, patData, intData, altData, audData, propData, simData] = await Promise.all([
        api.getDashboard().catch(() => null),
        api.getEntities().catch(() => []),
        api.getNetwork().catch(() => ({ nodes: [], edges: [] })),
        api.getRiskPatterns().catch(() => []),
        api.getInterventions().catch(() => ({ interventions: [], recommended: null })),
        api.getAlerts().catch(() => []),
        api.getAuditLogs().catch(() => []),
        api.runPropagation(selectedEntityId || 'ent-comp-a').catch(() => null),
        api.runSimulation(scenarioParams).catch(() => null),
      ]);

      if (kpiData) setKpis(kpiData);
      if (entData.length > 0) setEntities(entData);
      if (netData.edges) setRelationships(netData.edges);
      if (patData.length > 0) setPatterns(patData);
      if (intData.interventions) {
        setInterventions(intData.interventions);
        setRecommendedIntervention(intData.recommended || intData.interventions[0]);
      }
      if (altData.length > 0) setAlerts(altData);
      if (audData.length > 0) setAuditLogs(audData);
      if (propData) setPropagation(propData);
      if (simData) setScenarioResult(simData);
    } catch (e) {
      console.error('Error refreshing RiskFlow data:', e);
    } finally {
      setIsLoading(false);
    }
  }, [selectedEntityId, scenarioParams]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  // Real-Time Server-Sent Events (SSE) Listener
  useEffect(() => {
    let es: EventSource | null = null;
    try {
      es = new EventSource('/api/realtime/stream');

      es.addEventListener('CONNECTED', () => {
        setIsLiveConnected(true);
      });

      es.addEventListener('HEARTBEAT', () => {
        setIsLiveConnected(true);
      });

      es.addEventListener('DATASET_IMPORTED', (event) => {
        const data = JSON.parse(event.data);
        setLastEvent('DATASET_IMPORTED');
        showToast(data.payload?.message || 'New portfolio dataset ingested');
        refreshAll();
      });

      es.addEventListener('DEFAULT_PROPAGATION_SIMULATED', (event) => {
        const data = JSON.parse(event.data);
        setLastEvent('DEFAULT_PROPAGATION_SIMULATED');
        if (data.payload?.originEntityId) {
          api.getAuditLogs().then((logs) => setAuditLogs(logs)).catch(() => {});
        }
      });

      es.addEventListener('SCENARIO_RECALCULATED', () => {
        setLastEvent('SCENARIO_RECALCULATED');
        api.getAuditLogs().then((logs) => setAuditLogs(logs)).catch(() => {});
      });

      es.addEventListener('INTERVENTION_EXECUTED', (event) => {
        const data = JSON.parse(event.data);
        setLastEvent('INTERVENTION_EXECUTED');
        showToast(`Intervention executed on ${data.payload?.targetEntityName}`);
        refreshAll();
      });

      es.addEventListener('ALERT_STATUS_CHANGED', (event) => {
        const data = JSON.parse(event.data);
        setLastEvent('ALERT_STATUS_CHANGED');
        api.getAlerts().then((alts) => setAlerts(alts)).catch(() => {});
        api.getAuditLogs().then((logs) => setAuditLogs(logs)).catch(() => {});
      });

      es.addEventListener('DEMO_RESET', () => {
        setLastEvent('DEMO_RESET');
        showToast('RiskFlow dataset reset to baseline state');
        refreshAll();
      });

      es.onerror = () => {
        setIsLiveConnected(false);
      };
    } catch {
      setIsLiveConnected(false);
    }

    return () => {
      if (es) {
        es.close();
      }
    };
  }, [refreshAll, showToast]);

  const selectedEntity = entities.find((e) => e.id === selectedEntityId) || entities[0] || null;

  const runDefaultSimulation = async (entityId?: string): Promise<PropagationResult> => {
    setIsSimulatingPropagation(true);
    const targetId = entityId || selectedEntityId || 'ent-comp-a';
    try {
      const result = await api.runPropagation(targetId);
      setPropagation(result);
      showToast(`Default propagation simulated from ${result.originEntityName}: ₹${result.summary.networkExposure} Cr network exposure`);
      // Update audit logs
      const auds = await api.getAuditLogs().catch(() => []);
      if (auds.length > 0) setAuditLogs(auds);
      return result;
    } finally {
      setIsSimulatingPropagation(false);
    }
  };

  const recalculateScenario = async (customParams?: Partial<ScenarioParams>): Promise<ScenarioResult> => {
    setIsRecalculatingScenario(true);
    const merged = { ...scenarioParams, ...customParams };
    setScenarioParams(merged);
    try {
      const result = await api.runSimulation(merged);
      setScenarioResult(result);
      const auds = await api.getAuditLogs().catch(() => []);
      if (auds.length > 0) setAuditLogs(auds);
      return result;
    } finally {
      setIsRecalculatingScenario(false);
    }
  };

  const executeInterventionVector = async (id: string) => {
    try {
      const res = await api.executeIntervention(id);
      showToast(res.message);
      await refreshAll();
    } catch (err: any) {
      showToast(`Error executing intervention: ${err.message}`);
    }
  };

  const acknowledgeAlert = async (id: string) => {
    await api.updateAlertAction(id, 'acknowledge');
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'acknowledged' } : a)));
    showToast('Alert acknowledged');
  };

  const dismissAlert = async (id: string) => {
    await api.updateAlertAction(id, 'dismiss');
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'dismissed' } : a)));
    showToast('Alert dismissed');
  };

  const resetToDemoState = async () => {
    setIsLoading(true);
    await api.resetDemo();
    await refreshAll();
    showToast('RiskFlow dataset reset to baseline state');
  };

  return (
    <RiskFlowContext.Provider
      value={{
        activeView,
        setActiveView,
        kpis,
        entities,
        relationships,
        selectedEntityId,
        selectedEntity,
        setSelectedEntityId,
        patterns,
        selectedPatternId,
        setSelectedPatternId,
        interventions,
        recommendedIntervention,
        alerts,
        auditLogs,
        propagation,
        isSimulatingPropagation,
        runDefaultSimulation,
        scenarioParams,
        setScenarioParams,
        scenarioResult,
        isRecalculatingScenario,
        recalculateScenario,
        executeInterventionVector,
        acknowledgeAlert,
        dismissAlert,
        resetToDemoState,
        isLoading,
        refreshAll,
        searchModalOpen,
        setSearchModalOpen,
        searchQuery,
        setSearchQuery,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </RiskFlowContext.Provider>
  );
};

export const useRiskFlow = () => {
  const context = useContext(RiskFlowContext);
  if (!context) {
    throw new Error('useRiskFlow must be used within a RiskFlowProvider');
  }
  return context;
};

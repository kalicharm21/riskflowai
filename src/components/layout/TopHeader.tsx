import React, { useEffect, useState } from 'react';
import { useRiskFlow } from '../../context/RiskFlowContext';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { api } from '../../services/api';

export const TopHeader: React.FC = () => {
  const {
    activeView,
    setActiveView,
    setSearchModalOpen,
    resetToDemoState,
    runDefaultSimulation,
    isSimulatingPropagation,
    toastMessage,
    isLiveConnected,
  } = useRiskFlow();

  const [aiStatus, setAiStatus] = useState<{
    provider: string;
    isConfigured: boolean;
    model: string;
  } | null>(null);

  useEffect(() => {
    api.getAiStatus()
      .then((res) => {
        setAiStatus({ provider: res.provider, isConfigured: res.isConfigured, model: res.model });
      })
      .catch(() => {});
  }, []);

  const viewTitles: Record<string, { title: string; subtitle: string }> = {
    dashboard: { title: 'Command Center', subtitle: 'Institutional Risk Intelligence & Portfolio Propagation' },
    network: { title: 'Risk Network Graph', subtitle: 'Interactive Contagion & Node Interdependency Visualizer' },
    analysis: { title: 'Portfolio Analysis', subtitle: 'Comprehensive Loan Book & Exposure Distribution' },
    dna: { title: 'Risk DNA & Emerging Patterns', subtitle: '9-Dimensional Behavioural Profiles & Latent Risk Clusters' },
    simulator: { title: 'Scenario Simulator', subtitle: 'Macro-Economic Shock & Sensitivity Engine' },
    intervention: { title: 'Containment Vectors', subtitle: 'Targeted Risk Ring-Fencing & Intervention Optimization' },
    analyst: { title: 'AI Risk Analyst', subtitle: 'Evidence-Grounded Credit Risk Explanations' },
    alerts: { title: 'Institutional Alerts', subtitle: 'Real-Time Propagation & Covenant Breach Triage' },
    ingestion: { title: 'Data Ingestion & Normalization', subtitle: 'CSV / JSON Loan Book Importer & Quality Engine' },
    audit: { title: 'Compliance Audit Trail', subtitle: 'Immutable Activity Log & Decision Lineage' },
  };

  const current = viewTitles[activeView] || { title: 'RiskFlow', subtitle: 'Institutional Risk Intelligence' };

  return (
    <header
      id="top-header"
      className="h-16 bg-white border-b border-slate-200 px-6 sm:px-8 flex items-center justify-between z-20 shrink-0 select-none relative shadow-xs"
    >
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 bg-slate-900 border border-slate-800 text-white px-4 py-2 rounded-xl shadow-xl flex items-center gap-2 text-xs font-mono animate-bounce">
          <span className="material-symbols-outlined text-indigo-400 text-base">info</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Left: View Title & Breadcrumb */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">RISKFLOW //</span>
          <h1 className="text-base font-bold text-slate-900 tracking-tight font-sans">{current.title}</h1>
          {isLiveConnected ? (
            <Badge variant="low" size="sm" className="gap-1 hidden sm:inline-flex">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              LIVE SYNC
            </Badge>
          ) : (
            <Badge variant="secondary" size="sm" className="gap-1 hidden sm:inline-flex">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              CONNECTED
            </Badge>
          )}
        </div>
        <span className="text-xs text-slate-500 truncate font-sans hidden sm:block">
          {current.subtitle}
        </span>
      </div>

      {/* Center: Global Search Trigger */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
        <button
          id="btn-global-search-trigger"
          onClick={() => setSearchModalOpen(true)}
          className="w-full bg-slate-100 border border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-800 px-3.5 py-1.5 rounded-lg flex items-center justify-between text-xs transition-all shadow-xs cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm text-slate-400">search</span>
            <span className="truncate">Search entities, facilities, risk vectors...</span>
          </div>
          <kbd className="bg-white border border-slate-200 text-[10px] font-mono px-1.5 py-0.5 rounded text-slate-500 shadow-xs">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: Quick Actions */}
      <div className="flex items-center gap-2.5">
        {/* Simulate Default Quick Action */}
        <Button
          id="btn-quick-simulate-default"
          variant="destructive"
          size="sm"
          onClick={() => runDefaultSimulation('ent-comp-a')}
          disabled={isSimulatingPropagation}
          isLoading={isSimulatingPropagation}
          icon={<span className="material-symbols-outlined text-sm">play_arrow</span>}
          title="Simulate Default Propagation on Company A"
        >
          <span className="hidden lg:inline">Simulate Default</span>
        </Button>

        {/* Ask AI Analyst */}
        <Button
          id="btn-quick-ai-analyst"
          variant="primary"
          size="sm"
          onClick={() => setActiveView('analyst')}
          icon={<span className="material-symbols-outlined text-sm">auto_awesome</span>}
          title="Open AI Risk Analyst (Groq LPU)"
        >
          <span className="hidden sm:inline">Ask AI</span>
          <span className="text-[10px] bg-indigo-700/80 text-indigo-100 px-1.5 py-0.2 rounded font-mono uppercase ml-0.5">
            Groq
          </span>
        </Button>

        {/* Reset Demo Data */}
        <Button
          id="btn-reset-demo-state"
          variant="outline"
          size="sm"
          onClick={resetToDemoState}
          className="px-2"
          title="Reset Demo Dataset"
        >
          <span className="material-symbols-outlined text-base">restart_alt</span>
        </Button>
      </div>
    </header>
  );
};


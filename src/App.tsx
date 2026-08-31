import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { RiskFlowProvider, useRiskFlow } from './context/RiskFlowContext';
import { TopHeader } from './components/layout/TopHeader';
import { SideNavBar } from './components/layout/SideNavBar';
import { CommandCenter } from './components/dashboard/CommandCenter';
import { ScenarioSimulatorView } from './components/simulator/ScenarioSimulatorView';
import { RiskNetworkView } from './components/network/RiskNetworkView';
import { RiskContainmentView } from './components/intervention/RiskContainmentView';
import { RiskDnaView } from './components/dna/RiskDnaView';
import { PortfolioAnalysisView } from './components/analysis/PortfolioAnalysisView';
import { AiRiskAnalystView } from './components/analyst/AiRiskAnalystView';
import { DataIngestionView } from './components/ingestion/DataIngestionView';
import { AlertsView } from './components/alerts/AlertsView';
import { AuditLogView } from './components/audit/AuditLogView';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { LoginModal } from './components/common/LoginModal';

const MainContent: React.FC = () => {
  const { activeView } = useRiskFlow();

  return (
    <main className="flex-1 overflow-y-auto bg-slate-50">
      {(activeView === 'dashboard' || activeView === 'command') && <CommandCenter />}
      {activeView === 'simulator' && <ScenarioSimulatorView />}
      {activeView === 'network' && <RiskNetworkView />}
      {activeView === 'intervention' && <RiskContainmentView />}
      {activeView === 'dna' && <RiskDnaView />}
      {activeView === 'analysis' && <PortfolioAnalysisView />}
      {activeView === 'analyst' && <AiRiskAnalystView />}
      {activeView === 'ingestion' && <DataIngestionView />}
      {activeView === 'alerts' && <AlertsView />}
      {activeView === 'audit' && <AuditLogView />}
    </main>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <RiskFlowProvider>
        <div id="riskflow-root" className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
          <TopHeader />
          <div className="flex-1 flex overflow-hidden">
            <SideNavBar />
            <MainContent />
          </div>

          <GlobalSearchModal />
          <LoginModal />
        </div>
      </RiskFlowProvider>
    </AuthProvider>
  );
}

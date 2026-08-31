import React from 'react';
import { useRiskFlow, AppView } from '../../context/RiskFlowContext';
import { useAuth } from '../../context/AuthContext';

export const SideNavBar: React.FC = () => {
  const { activeView, setActiveView, alerts } = useRiskFlow();
  const { user, setLoginModalOpen } = useAuth();

  const activeAlertCount = alerts.filter((a) => a.status === 'active').length;

  const navItems: Array<{
    id: AppView;
    label: string;
    icon: string;
    badge?: number | string;
    badgeColor?: string;
  }> = [
    { id: 'dashboard', label: 'Command Center', icon: 'dashboard' },
    { id: 'network', label: 'Risk Network', icon: 'hub' },
    { id: 'analysis', label: 'Portfolio Analysis', icon: 'table_chart' },
    { id: 'dna', label: 'Risk DNA & Patterns', icon: 'fingerprint' },
    { id: 'simulator', label: 'Scenario Simulator', icon: 'tune' },
    { id: 'intervention', label: 'Containment Vectors', icon: 'shield' },
    { id: 'analyst', label: 'AI Risk Analyst', icon: 'auto_awesome' },
    {
      id: 'alerts',
      label: 'Live Alerts',
      icon: 'notifications_active',
      badge: activeAlertCount > 0 ? activeAlertCount : undefined,
      badgeColor: 'bg-[#93000a] text-[#ffb4ab]',
    },
    { id: 'ingestion', label: 'Data Ingestion', icon: 'upload_file' },
    { id: 'audit', label: 'Audit Trail', icon: 'receipt_long' },
  ];

  return (
    <aside
      id="side-nav-bar"
      className="w-16 hover:w-64 transition-all duration-300 ease-in-out bg-slate-900 border-r border-slate-800 flex flex-col justify-between z-30 group select-none shrink-0"
    >
      {/* Top Brand Logo */}
      <div className="flex flex-col">
        <div className="h-16 flex items-center px-4 gap-3 border-b border-slate-800 overflow-hidden">
          <div className="h-8 w-8 rounded-lg bg-indigo-500 flex items-center justify-center shrink-0 shadow-sm">
            <span className="material-symbols-outlined text-white text-lg">timeline</span>
          </div>
          <div className="flex flex-col opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap overflow-hidden">
            <span className="font-bold text-base tracking-tight text-white">
              Risk<span className="text-indigo-400">Flow</span>
            </span>
            <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">
              Institutional AI
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1 mt-2">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                id={`nav-btn-${item.id}`}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all relative ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/80'
                }`}
                title={item.label}
              >
                <span
                  className={`material-symbols-outlined text-lg shrink-0 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                >
                  {item.icon}
                </span>
                <span className="truncate opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-left font-sans">
                  {item.label}
                </span>

                {item.badge && (
                  <span
                    className={`ml-auto px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ${
                      item.badgeColor || 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom User Profile & Status */}
      <div className="p-3 border-t border-slate-800 space-y-2">
        {/* System Status Pill */}
        <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50 overflow-hidden">
          <div className="flex items-center gap-2 text-[10px]">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="text-slate-300 font-semibold uppercase tracking-wider truncate opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              Engine Synced
            </span>
          </div>
          <div className="hidden group-hover:block mt-1.5 pt-1.5 border-t border-slate-700/40">
            <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-400 w-4/5 rounded-full"></div>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">428 Facilities Monitored</p>
          </div>
        </div>

        {/* User Card */}
        <button
          id="btn-user-profile-trigger"
          onClick={() => setLoginModalOpen(true)}
          className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-slate-800 text-left transition-colors overflow-hidden"
        >
          <div className="h-8 w-8 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
            {user.initials}
          </div>
          <div className="flex flex-col min-w-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <span className="text-xs text-slate-200 font-bold truncate">{user.name}</span>
            <span className="text-[10px] text-slate-400 truncate">{user.role}</span>
          </div>
        </button>
      </div>
    </aside>
  );
};

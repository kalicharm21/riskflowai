import React, { useState } from 'react';
import { useRiskFlow } from '../../context/RiskFlowContext';
import { RiskBadge } from '../common/RiskBadge';

export const AlertsView: React.FC = () => {
  const { alerts, acknowledgeAlert, dismissAlert, setActiveView, setSelectedEntityId } = useRiskFlow();
  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  const filteredAlerts = alerts.filter((a) => {
    if (filterSeverity !== 'all' && a.severity !== filterSeverity) return false;
    return true;
  });

  return (
    <div id="alerts-view" className="p-6 space-y-6 max-w-5xl mx-auto overflow-y-auto">
      {/* Header */}
      <div className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-indigo-600">notifications_active</span>
            <h2 className="text-base font-bold text-slate-900">Real-time Risk Alert Triage Center</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Continuous automated monitoring of early-warning credit drift, contagion spikes, and rating breaches.
          </p>
        </div>

        {/* Severity Filter */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          {['all', 'CRITICAL', 'HIGH', 'WATCH'].map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-3 py-1.5 rounded-lg transition-all text-xs font-bold ${
                filterSeverity === sev
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {sev.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Alert Cards List */}
      <div className="space-y-3">
        {filteredAlerts.map((alert) => (
          <div
            key={alert.id}
            id={`alert-card-${alert.id}`}
            className={`p-4 rounded-2xl border transition-all shadow-xs ${
              alert.status === 'dismissed'
                ? 'bg-slate-50 border-slate-200 opacity-60'
                : alert.severity === 'CRITICAL'
                ? 'bg-rose-50/40 border-rose-200'
                : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <RiskBadge band={alert.severity} size="sm" />
                  <span className="text-sm font-bold text-slate-900">{alert.title}</span>
                  <span className="text-[10px] text-slate-400 font-medium">• {alert.timestamp}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{alert.description}</p>
                {alert.entityName && (
                  <div className="flex items-center gap-2 pt-1 text-xs">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Affiliated Borrower:</span>
                    <button
                      onClick={() => {
                        if (alert.entityId) setSelectedEntityId(alert.entityId);
                        setActiveView('network');
                      }}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
                    >
                      {alert.entityName} →
                    </button>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                {alert.status === 'active' && (
                  <button
                    onClick={() => acknowledgeAlert(alert.id)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold text-emerald-700 flex items-center gap-1 shadow-xs"
                  >
                    <span className="material-symbols-outlined text-sm">check</span>
                    Acknowledge
                  </button>
                )}
                {alert.status !== 'dismissed' && (
                  <button
                    onClick={() => dismissAlert(alert.id)}
                    className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-500 hover:text-rose-600 shadow-xs"
                  >
                    Dismiss
                  </button>
                )}
                {alert.status === 'acknowledged' && (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                    Acknowledged
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { AuditLogEntry } from '../../types/riskflow';

export const AuditLogView: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const data = await api.getAuditLogs();
      setLogs(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div id="audit-log-view" className="p-6 space-y-6 max-w-6xl mx-auto overflow-y-auto">
      {/* Header */}
      <div className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-indigo-600">history_edu</span>
            <h2 className="text-base font-bold text-slate-900">
              Verifiable Decision Lineage & Compliance Audit Trail
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Immutable cryptographic trail of all stress simulations, containment executions, and model parameter changes.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-indigo-600 flex items-center gap-1.5 self-start sm:self-auto shadow-xs"
        >
          <span className="material-symbols-outlined text-sm">refresh</span>
          Refresh Trail
        </button>
      </div>

      {/* Logs Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-mono text-[10px] uppercase border-b border-slate-100">
              <tr>
                <th className="py-3 px-4 font-bold">Timestamp (UTC)</th>
                <th className="py-3 px-4 font-bold">Institutional User</th>
                <th className="py-3 px-4 font-bold">Action Type</th>
                <th className="py-3 px-4 font-bold">Description</th>
                <th className="py-3 px-4 text-right font-bold">Inspect Metadata</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.map((log) => (
                <tr
                  key={log.id}
                  onClick={() => setSelectedLog(log)}
                  className="hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-4 font-mono text-slate-500 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 block">{log.userName}</span>
                    <span className="text-[10px] text-slate-400 font-medium">{log.userRole}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 max-w-xs truncate font-medium">
                    {log.description}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-xs text-indigo-600 font-bold hover:underline">
                      View Payload →
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payload Modal */}
      {selectedLog && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedLog(null)}
        >
          <div
            className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-xl p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono text-slate-400 font-bold uppercase block">
                  Log Entry // {selectedLog.id}
                </span>
                <h3 className="text-sm font-bold text-slate-900">{selectedLog.action}</h3>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            <div className="text-xs text-slate-600 leading-relaxed font-medium">
              {selectedLog.description}
            </div>

            {/* JSON Payload */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Audit Cryptographic Metadata
              </span>
              <pre className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 text-[11px] font-mono text-emerald-400 overflow-x-auto max-h-48">
                {JSON.stringify(selectedLog.metadata || {}, null, 2)}
              </pre>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 rounded-xl hover:bg-slate-200"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { useRiskFlow } from '../../context/RiskFlowContext';
import { InterventionVector } from '../../types/riskflow';

export const RiskContainmentView: React.FC = () => {
  const {
    interventions,
    recommendedIntervention,
    executeInterventionVector,
    setActiveView,
    setSelectedEntityId,
  } = useRiskFlow();

  const [selectedInterventionId, setSelectedInterventionId] = useState<string>(
    recommendedIntervention?.id || 'int-comp-b'
  );
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionSuccess, setExecutionSuccess] = useState<string | null>(null);

  const activeIntv =
    interventions.find((i) => i.id === selectedInterventionId) ||
    recommendedIntervention ||
    interventions[0];

  const handleExecute = async (id: string) => {
    setIsExecuting(true);
    try {
      await executeInterventionVector(id);
      setExecutionSuccess(`Containment protocol executed on ${activeIntv.targetEntityName}. Downstream transmission quarantined.`);
      setTimeout(() => setExecutionSuccess(null), 5000);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div id="risk-containment-view" className="p-6 space-y-6 max-w-7xl mx-auto overflow-y-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-600">shield</span>
            <h2 className="text-base font-bold text-slate-900">
              Optimal Containment & Intervention Optimization
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Identify the single highest-leverage node to inject liquidity or ring-fence receivables to prevent nonlinear systemic cascade.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView('network')}
            className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs text-indigo-600 font-bold flex items-center gap-1.5 shadow-xs"
          >
            <span className="material-symbols-outlined text-sm">hub</span>
            Inspect Graph
          </button>
        </div>
      </div>

      {/* Execution Success Notification */}
      {executionSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-3 shadow-xs">
          <span className="material-symbols-outlined text-lg text-emerald-600">verified</span>
          <span>{executionSuccess}</span>
        </div>
      )}

      {/* Primary Recommended Containment Card (Screen 1 Main Spotlight) */}
      <div className="bg-white border-2 border-indigo-200 rounded-2xl p-6 relative overflow-hidden shadow-sm">
        {/* Recommended Top Badge */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-indigo-600 animate-ping" />
              Rank #1 Optimal Containment Point
            </span>
            <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full font-bold">
              {activeIntv.confidence}% Model Confidence
            </span>
          </div>

          <span className="text-xs text-slate-500 font-medium">
            Target Entity: <span className="text-slate-900 font-bold">{activeIntv.targetEntityName}</span>
          </span>
        </div>

        {/* Title & Action Name */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{activeIntv.title}</h3>
          <p className="text-sm text-indigo-600 font-semibold mt-1">{activeIntv.actionName}</p>
        </div>

        {/* 4-Stat Mathematical Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-6">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Avoided Loss</span>
            <span className="text-2xl font-bold font-mono text-emerald-600 mt-0.5 block">
              ₹{activeIntv.avoidedLoss} Cr
            </span>
            <span className="text-[10px] text-slate-400 font-medium">Downstream failure</span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Cost to Intervene</span>
            <span className="text-2xl font-bold font-mono text-amber-600 mt-0.5 block">
              ₹{activeIntv.costToIntervene} Cr
            </span>
            <span className="text-[10px] text-slate-400 font-medium">Targeted capital buffer</span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Efficiency Ratio</span>
            <span className="text-2xl font-bold font-mono text-indigo-600 mt-0.5 block">
              {activeIntv.efficiencyRatio}x EV
            </span>
            <span className="text-[10px] text-slate-400 font-medium">Avoided loss / cost</span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Downstream Insulated</span>
            <span className="text-2xl font-bold font-mono text-slate-900 mt-0.5 block">
              {activeIntv.downstreamCount} Facilities
            </span>
            <span className="text-[10px] text-slate-400 font-medium">Sub-tier suppliers</span>
          </div>
        </div>

        {/* Rationale & Action Controls */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
            {activeIntv.description}
          </p>

          <button
            id="btn-execute-containment-vector"
            onClick={() => handleExecute(activeIntv.id)}
            disabled={isExecuting}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-2 shrink-0 transition-all disabled:opacity-50"
          >
            <span className={`material-symbols-outlined text-base ${isExecuting ? 'animate-spin' : ''}`}>
              {isExecuting ? 'refresh' : 'verified_user'}
            </span>
            <span>{isExecuting ? 'Executing Protocol...' : 'Execute Containment Protocol'}</span>
          </button>
        </div>
      </div>

      {/* Visual Topography Comparison: Uncontained vs Contained */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-indigo-600">account_tree</span>
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Contagion Topography: Uncontained vs Contained Cascade
            </span>
          </div>
          <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            Net Savings: ₹{(activeIntv.avoidedLoss - activeIntv.costToIntervene).toFixed(1)} Cr
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Uncontained Contagion Tree */}
          <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-200 relative">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-rose-700 uppercase">Uncontained Cascade</span>
              <span className="text-[11px] font-mono text-rose-600 font-bold">Total at Risk: ₹26.4 Cr</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3 p-2.5 rounded-lg bg-white border border-rose-200 shadow-xs">
                <span className="font-bold text-rose-700 text-[10px] bg-rose-100 px-2 py-0.5 rounded uppercase">Origin</span>
                <span className="font-bold text-slate-900">Company A (Logistics)</span>
                <span className="font-mono text-rose-600 font-bold ml-auto">₹8.7 Cr</span>
              </div>
              <div className="pl-6 border-l-2 border-rose-300 space-y-2">
                <div className="flex items-center gap-3 p-2.5 rounded-lg bg-white border border-rose-200 shadow-xs">
                  <span className="font-bold text-rose-700 text-[10px] bg-rose-100 px-2 py-0.5 rounded uppercase">Cascade</span>
                  <span className="font-bold text-slate-900">Company B (Manufacturing)</span>
                  <span className="font-mono text-rose-600 font-bold ml-auto">₹18.2 Cr</span>
                </div>
                <div className="pl-6 border-l-2 border-rose-300 space-y-2">
                  <div className="flex items-center gap-3 p-2.5 rounded-lg bg-white border border-rose-200 shadow-xs">
                    <span className="font-bold text-rose-700 text-[10px] bg-rose-100 px-2 py-0.5 rounded uppercase">Collapse</span>
                    <span className="font-bold text-slate-900">Company C (Assembly)</span>
                    <span className="font-mono text-rose-600 font-bold ml-auto">₹12.5 Cr</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contained Tree with Shield */}
          <div className="p-4 rounded-xl bg-emerald-50/40 border border-emerald-200 relative">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-emerald-700 uppercase">Contained Protocol Applied</span>
              <span className="text-[11px] font-mono text-emerald-600 font-bold">Residual Exposure: ₹8.7 Cr</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3 p-2.5 rounded-lg bg-white border border-slate-200 shadow-xs">
                <span className="font-bold text-slate-600 text-[10px] bg-slate-100 px-2 py-0.5 rounded uppercase">Quarantined</span>
                <span className="font-bold text-slate-900">Company A (Logistics)</span>
                <span className="font-mono text-slate-500 font-bold ml-auto">₹8.7 Cr</span>
              </div>
              <div className="pl-6 border-l-2 border-indigo-400 space-y-2">
                <div className="flex items-center gap-3 p-2.5 rounded-lg bg-white border border-indigo-200 shadow-xs">
                  <span className="font-bold text-indigo-700 text-[10px] bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded flex items-center gap-1 uppercase">
                    <span className="material-symbols-outlined text-xs">shield</span>
                    Ring-Fenced
                  </span>
                  <span className="font-bold text-slate-900">Company B (Manufacturing)</span>
                  <span className="font-mono text-emerald-600 font-bold ml-auto">₹4.1 Cr Cost</span>
                </div>
                <div className="pl-6 border-l-2 border-emerald-400 space-y-2">
                  <div className="flex items-center gap-3 p-2.5 rounded-lg bg-white border border-emerald-200 shadow-xs">
                    <span className="font-bold text-emerald-700 text-[10px] bg-emerald-50 px-2 py-0.5 rounded uppercase">Insulated</span>
                    <span className="font-bold text-slate-900">Company C (Assembly)</span>
                    <span className="font-mono text-emerald-600 font-bold ml-auto">0% Cascade</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ranked Containment Vectors Comparison Grid */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">All Analyzed Intervention Vectors</span>
          <span className="text-[11px] text-slate-400 font-medium">Ranked by Return on Containment Capital</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {interventions.map((intv) => {
            const isSelected = activeIntv.id === intv.id;
            return (
              <div
                key={intv.id}
                onClick={() => setSelectedInterventionId(intv.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-indigo-50/50 border-indigo-300 shadow-xs'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-900">{intv.title}</span>
                  <span className="text-xs font-mono font-bold text-emerald-600">
                    {intv.efficiencyRatio}x EV
                  </span>
                </div>

                <p className="text-[11px] text-indigo-600 font-semibold mb-3 line-clamp-1">{intv.actionName}</p>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono p-2.5 rounded-xl bg-white border border-slate-200 mb-3">
                  <div>
                    <span className="text-[9px] text-slate-400 font-bold block uppercase">Avoided</span>
                    <span className="text-emerald-600 font-bold">₹{intv.avoidedLoss} Cr</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 font-bold block uppercase">Cost</span>
                    <span className="text-amber-600 font-bold">₹{intv.costToIntervene} Cr</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-medium">{intv.confidence}% Confidence</span>
                  <span className="text-indigo-600 font-bold">Select Vector →</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

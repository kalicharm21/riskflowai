import React, { useState } from 'react';
import { useRiskFlow } from '../../context/RiskFlowContext';
import { calculateRiskDNA } from '../../data/seedData';
import { RiskBadge } from '../common/RiskBadge';

export const RiskDnaView: React.FC = () => {
  const {
    entities,
    selectedEntityId,
    setSelectedEntityId,
    selectedEntity,
    patterns,
    selectedPatternId,
    setSelectedPatternId,
    setActiveView,
  } = useRiskFlow();

  const [activeTab, setActiveTab] = useState<'profile' | 'patterns'>('profile');

  const currentEntity = selectedEntity || entities[0];
  const dna = calculateRiskDNA(currentEntity);

  const currentPattern =
    patterns.find((p) => p.id === selectedPatternId || p.code === 'Risk DNA #017') ||
    patterns[0];

  const dimensionKeys = [
    { key: 'cashFlowStability', label: 'Cash Flow Stability', desc: 'Operating cash coverage vs debt service' },
    { key: 'debtPressure', label: 'Debt Pressure', desc: 'Leverage and debt-to-equity elasticity' },
    { key: 'repaymentBehaviour', label: 'Repayment Behaviour', desc: 'Historic 30/60/90 day delinquency trajectory' },
    { key: 'collateralSensitivity', label: 'Collateral Sensitivity', desc: 'LTV sensitivity to property and asset depreciation' },
    { key: 'creditHistory', label: 'Credit History', desc: 'Long-term bureau and banking syndicate track record' },
    { key: 'economicSensitivity', label: 'Economic Sensitivity', desc: 'Elasticity to rate hikes and inflation' },
    { key: 'networkDependency', label: 'Network Dependency', desc: 'Contagion vulnerability from top 2 customers/suppliers' },
    { key: 'behaviouralDrift', label: 'Behavioural Drift', desc: 'Recent velocity shifts in credit line drawing' },
    { key: 'novelty', label: 'Novelty / Anomaly', desc: 'Divergence from historical peer group standard' },
  ];

  return (
    <div id="risk-dna-view" className="p-6 space-y-6 max-w-7xl mx-auto overflow-y-auto">
      {/* Top Banner & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-indigo-600">fingerprint</span>
            <h2 className="text-base font-bold text-slate-900">
              9-Dimensional Risk DNA & Latent Pattern Intelligence
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Deconstruct complex entity credit risks into orthogonal behavioral dimensions and uncover emerging systemic clusters.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'profile'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Entity Risk DNA Profile
          </button>
          <button
            onClick={() => setActiveTab('patterns')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'patterns'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Emerging Risk Patterns ({patterns.length})
          </button>
        </div>
      </div>

      {activeTab === 'profile' ? (
        /* Tab 1: Entity Risk DNA 9D Decomposition */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left (4 Cols): Entity Selector & Summary */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 space-y-5 shadow-xs">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
                Select Entity to Profile
              </label>
              <select
                value={selectedEntityId}
                onChange={(e) => setSelectedEntityId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none font-semibold"
              >
                {entities.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name} (Risk Score: {e.riskScore} • Rating: {e.riskRating})
                  </option>
                ))}
              </select>
            </div>

            {/* Current Profile Card */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">{currentEntity.name}</span>
                <RiskBadge band={currentEntity.riskRating} size="sm" />
              </div>
              <div className="text-[11px] text-slate-500">
                {currentEntity.sector} • {currentEntity.region}
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Total Exposure</span>
                  <span className="font-bold text-slate-900 text-sm">₹{currentEntity.totalExposure} Cr</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Prob of Default</span>
                  <span className="font-bold text-rose-600 text-sm">{currentEntity.pd}%</span>
                </div>
              </div>
            </div>

            {/* Dominant Risk Factors */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                Dominant Behavioral Risk Factors
              </span>
              <div className="space-y-1.5">
                {dna.dominantFactors.map((factor, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs font-medium text-rose-800 flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm text-rose-600">warning</span>
                    <span className="truncate">{factor}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setActiveView('network')}
              className="w-full py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs text-indigo-600 font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs"
            >
              <span className="material-symbols-outlined text-sm">hub</span>
              Inspect in Network Graph
            </button>
          </div>

          {/* Right (8 Cols): 9-Dimension Breakdown Bars */}
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                9-Dimensional Behavioural Tensor Breakdown
              </span>
              <span className="text-[11px] font-bold text-slate-400">SCALE: 0 (OPTIMAL) TO 100 (HIGH RISK)</span>
            </div>

            <div className="space-y-4">
              {dimensionKeys.map((dim) => {
                const val = (dna.dimensions as any)[dim.key] || 50;
                const isHigh = val >= 70;
                const isMed = val >= 50;

                const barColor = isHigh
                  ? 'bg-rose-500'
                  : isMed
                  ? 'bg-amber-500'
                  : 'bg-emerald-500';

                return (
                  <div key={dim.key} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-800">{dim.label}</span>
                        <span className="text-[11px] text-slate-400 ml-2 hidden sm:inline">{dim.desc}</span>
                      </div>
                      <span className="font-mono font-bold text-slate-900">{val}/100</span>
                    </div>

                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${barColor} rounded-full transition-all duration-500`}
                        style={{ width: `${val}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Tab 2: Emerging Risk Patterns Explorer */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left (4 Cols): Pattern Selector */}
          <div className="lg:col-span-4 space-y-3">
            {patterns.map((p) => {
              const isSelected = p.id === currentPattern.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPatternId(p.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-indigo-50/60 border-indigo-300 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                      {p.code}
                    </span>
                    <span className="text-[10px] font-mono text-amber-700 font-bold">
                      +{p.modelGap} pp gap
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 mb-1">{p.title}</h3>
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{p.description}</p>

                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100 text-[10px] font-bold text-slate-400">
                    <span>{p.affectedLoansCount} Affected Loans</span>
                    <span>Observed: {p.observedDefaultRate}%</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right (8 Cols): Detailed Pattern Deep Dive */}
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block mb-1">
                  Latent Cluster Archetype // {currentPattern.code}
                </span>
                <h3 className="text-xl font-bold text-slate-900">{currentPattern.title}</h3>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold bg-slate-100 border border-slate-200 px-3 py-1 rounded-lg text-slate-700">
                  Trend: {currentPattern.trend.toUpperCase()}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {currentPattern.description}
            </p>

            {/* Pattern Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">Total Volume</span>
                <span className="text-lg font-bold font-mono text-slate-900">
                  ₹{currentPattern.totalExposure} Cr
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">Affected Loans</span>
                <span className="text-lg font-bold font-mono text-slate-900">
                  {currentPattern.affectedLoansCount} Units
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">Observed Default</span>
                <span className="text-lg font-bold font-mono text-rose-600">
                  {currentPattern.observedDefaultRate}%
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">Model Baseline</span>
                <span className="text-lg font-bold font-mono text-emerald-600">
                  {currentPattern.expectedDefaultRate}%
                </span>
              </div>
            </div>

            {/* Dominant Feature Signatures */}
            <div>
              <span className="text-xs font-bold text-slate-900 block mb-3 uppercase tracking-wider">
                Dominant Feature Signatures & Anomaly Drivers
              </span>
              <div className="space-y-2">
                {currentPattern.dominantFeatures.map((feat, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-800 flex items-center gap-3 font-medium"
                  >
                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400">First detected: {currentPattern.firstDetected}</span>
              <button
                onClick={() => setActiveView('analyst')}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-2 transition-all"
              >
                <span className="material-symbols-outlined text-sm">auto_awesome</span>
                Ask AI Analyst to Explain {currentPattern.code}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { useRiskFlow } from '../../context/RiskFlowContext';
import { RiskBadge } from '../common/RiskBadge';

export const ScenarioSimulatorView: React.FC = () => {
  const {
    scenarioParams,
    setScenarioParams,
    scenarioResult,
    isRecalculatingScenario,
    recalculateScenario,
    setActiveView,
    setSelectedEntityId,
  } = useRiskFlow();

  const presets = [
    {
      name: 'Stagflation Crisis',
      params: { interestRate: 3.5, propertyValue: -15, borrowerIncome: -12, unemployment: 4.5, commodityCost: 22, liquidityStress: 35 },
    },
    {
      name: 'Property Correction',
      params: { interestRate: 2.0, propertyValue: -25, borrowerIncome: -5, unemployment: 2.0, commodityCost: 5, liquidityStress: 40 },
    },
    {
      name: 'Liquidity Freeze',
      params: { interestRate: 1.5, propertyValue: -8, borrowerIncome: -10, unemployment: 3.0, commodityCost: 10, liquidityStress: 70 },
    },
    {
      name: 'Baseline (Calm)',
      params: { interestRate: 0, propertyValue: 0, borrowerIncome: 0, unemployment: 0, commodityCost: 0, liquidityStress: 0 },
    },
  ];

  const handleApplyPreset = (presetParams: typeof scenarioParams) => {
    recalculateScenario(presetParams);
  };

  const delta = scenarioResult?.delta || {
    portfolioRiskDelta: 15.0,
    additionalExposure: 37.4,
    newHighRiskLoans: 84,
    estimatedLossDelta: 6.8,
    riskPropagationDepth: 3,
  };

  const baseline = scenarioResult?.baseline || {
    portfolioRisk: 42.0,
    totalExposure: 842.6,
    expectedLoss: 31.4,
    highRiskLoans: 428,
  };

  const scenario = scenarioResult?.scenario || {
    portfolioRisk: 57.0,
    totalExposure: 880.0,
    expectedLoss: 38.2,
    highRiskLoans: 512,
  };

  const shockedEntities = scenarioResult?.shockedEntities || [
    { id: 'ent-comp-a', name: 'Company A', baselineRisk: 82, scenarioRisk: 96, delta: 14.0, riskBand: 'CRITICAL' },
    { id: 'ent-comp-b', name: 'Company B', baselineRisk: 68, scenarioRisk: 84, delta: 16.0, riskBand: 'CRITICAL' },
    { id: 'ent-comp-c', name: 'Company C', baselineRisk: 88, scenarioRisk: 98, delta: 10.0, riskBand: 'CRITICAL' },
    { id: 'ent-comp-d', name: 'Company D', baselineRisk: 61, scenarioRisk: 75, delta: 14.0, riskBand: 'HIGH' },
    { id: 'ent-comp-e', name: 'Company E', baselineRisk: 54, scenarioRisk: 68, delta: 14.0, riskBand: 'WATCH' },
    { id: 'ent-evergrande', name: 'Evergrande Group', baselineRisk: 94, scenarioRisk: 99, delta: 5.0, riskBand: 'CRITICAL' },
    { id: 'ent-shengjing', name: 'Shengjing Bank', baselineRisk: 76, scenarioRisk: 92, delta: 16.0, riskBand: 'CRITICAL' },
  ];

  return (
    <div id="scenario-simulator-view" className="p-6 space-y-6 max-w-7xl mx-auto overflow-y-auto">
      {/* Top Banner / Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-indigo-600">tune</span>
            <h2 className="text-base font-bold text-slate-900">Macro Scenario Stress Testing Engine</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Evaluate simultaneous multi-factor macro shocks and measure nonlinear risk contagion across all facilities.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            id="btn-find-best-intervention"
            onClick={() => setActiveView('intervention')}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-2 transition-all"
          >
            <span className="material-symbols-outlined text-base">shield</span>
            Find Best Intervention
          </button>
        </div>
      </div>

      {/* Main Grid: Controls Panel on Left (4 cols) vs Results & Graphs on Right (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left (4 Cols): Sliders & Presets */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 space-y-5 shadow-xs">
          {/* Presets */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
              Macro Stress Presets
            </span>
            <div className="grid grid-cols-2 gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => handleApplyPreset(preset.params)}
                  className="px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs text-slate-800 font-semibold transition-all text-left truncate"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Sliders */}
          <div className="space-y-4 pt-3 border-t border-slate-100">
            {/* Interest Rate */}
            <div>
              <div className="flex justify-between text-xs mb-1 font-medium">
                <span className="text-slate-600">Interest Rate Shock</span>
                <span className="font-mono font-bold text-indigo-600">
                  {scenarioParams.interestRate > 0 ? `+${scenarioParams.interestRate}%` : `${scenarioParams.interestRate}%`}
                </span>
              </div>
              <input
                id="slider-interest-rate"
                type="range"
                min="-5"
                max="5"
                step="0.5"
                value={scenarioParams.interestRate}
                onChange={(e) => setScenarioParams((p) => ({ ...p, interestRate: parseFloat(e.target.value) }))}
                className="w-full accent-indigo-600"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>-5.0%</span>
                <span>0.0%</span>
                <span>+5.0%</span>
              </div>
            </div>

            {/* Property Value */}
            <div>
              <div className="flex justify-between text-xs mb-1 font-medium">
                <span className="text-slate-600">Property Value Shock</span>
                <span className="font-mono font-bold text-rose-600">
                  {scenarioParams.propertyValue > 0 ? `+${scenarioParams.propertyValue}%` : `${scenarioParams.propertyValue}%`}
                </span>
              </div>
              <input
                id="slider-property-value"
                type="range"
                min="-30"
                max="30"
                step="1"
                value={scenarioParams.propertyValue}
                onChange={(e) => setScenarioParams((p) => ({ ...p, propertyValue: parseFloat(e.target.value) }))}
                className="w-full accent-rose-600"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>-30%</span>
                <span>0%</span>
                <span>+30%</span>
              </div>
            </div>

            {/* Borrower Income */}
            <div>
              <div className="flex justify-between text-xs mb-1 font-medium">
                <span className="text-slate-600">Borrower Income Shock</span>
                <span className="font-mono font-bold text-amber-600">
                  {scenarioParams.borrowerIncome > 0 ? `+${scenarioParams.borrowerIncome}%` : `${scenarioParams.borrowerIncome}%`}
                </span>
              </div>
              <input
                id="slider-borrower-income"
                type="range"
                min="-25"
                max="25"
                step="1"
                value={scenarioParams.borrowerIncome}
                onChange={(e) => setScenarioParams((p) => ({ ...p, borrowerIncome: parseFloat(e.target.value) }))}
                className="w-full accent-amber-600"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>-25%</span>
                <span>0%</span>
                <span>+25%</span>
              </div>
            </div>

            {/* Unemployment */}
            <div>
              <div className="flex justify-between text-xs mb-1 font-medium">
                <span className="text-slate-600">Unemployment Shock</span>
                <span className="font-mono font-bold text-slate-900">
                  {scenarioParams.unemployment > 0 ? `+${scenarioParams.unemployment}%` : `${scenarioParams.unemployment}%`}
                </span>
              </div>
              <input
                id="slider-unemployment"
                type="range"
                min="0"
                max="15"
                step="0.5"
                value={scenarioParams.unemployment}
                onChange={(e) => setScenarioParams((p) => ({ ...p, unemployment: parseFloat(e.target.value) }))}
                className="w-full accent-slate-700"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>0.0%</span>
                <span>+7.5%</span>
                <span>+15.0%</span>
              </div>
            </div>

            {/* Commodity Cost */}
            <div>
              <div className="flex justify-between text-xs mb-1 font-medium">
                <span className="text-slate-600">Commodity Cost Shock</span>
                <span className="font-mono font-bold text-slate-900">
                  {scenarioParams.commodityCost > 0 ? `+${scenarioParams.commodityCost}%` : `${scenarioParams.commodityCost}%`}
                </span>
              </div>
              <input
                id="slider-commodity-cost"
                type="range"
                min="-20"
                max="40"
                step="1"
                value={scenarioParams.commodityCost}
                onChange={(e) => setScenarioParams((p) => ({ ...p, commodityCost: parseFloat(e.target.value) }))}
                className="w-full accent-slate-700"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>-20%</span>
                <span>+10%</span>
                <span>+40%</span>
              </div>
            </div>
          </div>

          {/* Calculate Trigger */}
          <button
            id="btn-recalculate-scenario-stress"
            onClick={() => recalculateScenario()}
            disabled={isRecalculatingScenario}
            className="w-full py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 text-xs font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-xs"
          >
            <span className={`material-symbols-outlined text-sm ${isRecalculatingScenario ? 'animate-spin' : ''}`}>
              {isRecalculatingScenario ? 'refresh' : 'sync'}
            </span>
            <span>{isRecalculatingScenario ? 'Recalculating Stress Model...' : 'Apply Shocks to Network'}</span>
          </button>
        </div>

        {/* Right (8 Cols): Results, Topography Comparison & Table */}
        <div className="lg:col-span-8 space-y-6">
          {/* Top Impact Delta Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white border border-rose-200 p-4 rounded-2xl shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Portfolio Risk</span>
              <div className="text-xl font-bold font-mono text-rose-600 mt-0.5">
                +{delta.portfolioRiskDelta} pp
              </div>
              <span className="text-[10px] text-slate-500 font-mono block">
                {baseline.portfolioRisk}% → {scenario.portfolioRisk}%
              </span>
            </div>

            <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Additional Exposure</span>
              <div className="text-xl font-bold font-mono text-amber-600 mt-0.5">
                +₹{delta.additionalExposure} Cr
              </div>
              <span className="text-[10px] text-slate-500 font-mono block">
                ₹{baseline.totalExposure} → ₹{scenario.totalExposure} Cr
              </span>
            </div>

            <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">New High-Risk Loans</span>
              <div className="text-xl font-bold font-mono text-rose-600 mt-0.5">
                +{delta.newHighRiskLoans} Units
              </div>
              <span className="text-[10px] text-slate-500 font-mono block">
                {baseline.highRiskLoans} → {scenario.highRiskLoans}
              </span>
            </div>

            <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Addl Expected Loss</span>
              <div className="text-xl font-bold font-mono text-rose-600 mt-0.5">
                +₹{delta.estimatedLossDelta} Cr
              </div>
              <span className="text-[10px] text-slate-500 font-mono block">
                ₹{baseline.expectedLoss} → ₹{scenario.expectedLoss} Cr
              </span>
            </div>
          </div>

          {/* Before Shock vs After Shock Split Canvas */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-indigo-600">compare</span>
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Network Contagion Topography (Before vs After Shock)
                </span>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Nonlinear Sensitivity Tensors</span>
            </div>

            {/* Split Topography Visualizer */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Before Shock Canvas */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-emerald-700">BASELINE TOPOGRAPHY</span>
                  <span className="text-[10px] font-mono text-slate-400 font-bold">Avg Risk: 42.0%</span>
                </div>
                <div className="h-44 flex items-center justify-center relative">
                  <svg className="w-full h-full" viewBox="0 0 300 160">
                    <line x1="60" y1="40" x2="150" y2="90" stroke="#cbd5e1" strokeWidth="2" />
                    <line x1="150" y1="90" x2="240" y2="40" stroke="#cbd5e1" strokeWidth="2" />
                    <line x1="150" y1="90" x2="240" y2="130" stroke="#cbd5e1" strokeWidth="2" />
                    <line x1="60" y1="40" x2="100" y2="130" stroke="#cbd5e1" strokeWidth="2" />

                    {/* Nodes */}
                    <circle cx="60" cy="40" r="16" fill="#fbbf24" fillOpacity="0.2" stroke="#f59e0b" strokeWidth="2" />
                    <text x="60" y="44" textAnchor="middle" fill="#1e293b" fontSize="9" fontWeight="bold" fontFamily="monospace">A</text>

                    <circle cx="150" cy="90" r="18" fill="#818cf8" fillOpacity="0.2" stroke="#6366f1" strokeWidth="2" />
                    <text x="150" y="94" textAnchor="middle" fill="#1e293b" fontSize="9" fontWeight="bold" fontFamily="monospace">B</text>

                    <circle cx="240" cy="40" r="14" fill="#fbbf24" fillOpacity="0.2" stroke="#f59e0b" strokeWidth="2" />
                    <text x="240" y="44" textAnchor="middle" fill="#1e293b" fontSize="9" fontWeight="bold" fontFamily="monospace">C</text>

                    <circle cx="240" cy="130" r="12" fill="#34d399" fillOpacity="0.2" stroke="#10b981" strokeWidth="2" />
                    <text x="240" y="134" textAnchor="middle" fill="#1e293b" fontSize="9" fontWeight="bold" fontFamily="monospace">E</text>

                    <circle cx="100" cy="130" r="14" fill="#818cf8" fillOpacity="0.2" stroke="#6366f1" strokeWidth="2" />
                    <text x="100" y="134" textAnchor="middle" fill="#1e293b" fontSize="9" fontWeight="bold" fontFamily="monospace">D</text>
                  </svg>
                </div>
                <div className="text-[10px] text-slate-500 text-center font-medium">
                  Contained transmission buffers • Low systemic pressure
                </div>
              </div>

              {/* After Shock Canvas */}
              <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-200 relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-rose-700">SHOCKED TOPOGRAPHY</span>
                  <span className="text-[10px] font-mono text-rose-600 font-bold">Avg Risk: {scenario.portfolioRisk}%</span>
                </div>
                <div className="h-44 flex items-center justify-center relative">
                  <svg className="w-full h-full" viewBox="0 0 300 160">
                    <line x1="60" y1="40" x2="150" y2="90" stroke="#f43f5e" strokeWidth="3" strokeDasharray="4 2" />
                    <line x1="150" y1="90" x2="240" y2="40" stroke="#f43f5e" strokeWidth="3" strokeDasharray="4 2" />
                    <line x1="150" y1="90" x2="240" y2="130" stroke="#fbbf24" strokeWidth="2" />
                    <line x1="60" y1="40" x2="100" y2="130" stroke="#fbbf24" strokeWidth="2" />

                    {/* Nodes with stress glow */}
                    <circle cx="60" cy="40" r="18" fill="#e11d48" fillOpacity="0.9" stroke="#fda4af" strokeWidth="2.5" />
                    <circle cx="60" cy="40" r="24" fill="none" stroke="#f43f5e" strokeOpacity="0.4" className="animate-ping" />
                    <text x="60" y="44" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold" fontFamily="monospace">A (96)</text>

                    <circle cx="150" cy="90" r="20" fill="#e11d48" fillOpacity="0.8" stroke="#fda4af" strokeWidth="2.5" />
                    <text x="150" y="94" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold" fontFamily="monospace">B (84)</text>

                    <circle cx="240" cy="40" r="16" fill="#e11d48" fillOpacity="0.9" stroke="#fda4af" strokeWidth="2.5" />
                    <text x="240" y="44" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold" fontFamily="monospace">C (98)</text>

                    <circle cx="240" cy="130" r="14" fill="#f59e0b" fillOpacity="0.8" stroke="#fde68a" strokeWidth="2" />
                    <text x="240" y="134" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold" fontFamily="monospace">E (68)</text>

                    <circle cx="100" cy="130" r="16" fill="#f59e0b" fillOpacity="0.8" stroke="#fde68a" strokeWidth="2" />
                    <text x="100" y="134" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold" fontFamily="monospace">D (75)</text>
                  </svg>
                </div>
                <div className="text-[10px] text-rose-700 text-center font-bold">
                  Severe cascading stress • Company B identified as pivotal bottleneck
                </div>
              </div>
            </div>
          </div>

          {/* Stressed Entities Sensitivity Table */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Entity-Level Sensitivity Breakdown</span>
              <span className="text-[11px] text-slate-400 font-medium">Sorted by stress magnitude</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-mono text-[10px] uppercase border-b border-slate-100">
                  <tr>
                    <th className="py-2.5 px-4 font-bold">Entity</th>
                    <th className="py-2.5 px-3 font-bold">Baseline Risk</th>
                    <th className="py-2.5 px-3 font-bold">Scenario Risk</th>
                    <th className="py-2.5 px-3 font-bold">Stress Delta</th>
                    <th className="py-2.5 px-3 font-bold">Scenario Rating</th>
                    <th className="py-2.5 px-4 text-right font-bold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {shockedEntities.map((ent) => (
                    <tr key={ent.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 px-4 font-bold text-slate-900">
                        {ent.name}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-500">
                        {ent.baselineRisk}%
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-rose-600">
                        {ent.scenarioRisk}%
                      </td>
                      <td className="py-2.5 px-3 font-mono text-rose-600 font-bold">
                        +{ent.delta} pp
                      </td>
                      <td className="py-2.5 px-3">
                        <RiskBadge band={ent.riskBand} size="sm" />
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedEntityId(ent.id);
                            setActiveView('network');
                          }}
                          className="text-[11px] text-indigo-600 hover:text-indigo-800 font-bold"
                        >
                          Inspect Node →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

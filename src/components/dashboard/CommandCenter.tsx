import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useRiskFlow } from '../../context/RiskFlowContext';
import { MetricCard } from '../common/MetricCard';
import { RiskBadge } from '../common/RiskBadge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Tooltip } from '../ui/Tooltip';

// Contagion Loss Propagation Trajectory Data
const CONTAGION_TIMELINE_DATA = [
  { day: 'Day 0', unmitigatedLoss: 8.7, mitigatedLoss: 8.7, baselineLoss: 8.7, networkAtRisk: 8.7 },
  { day: 'Day 15', unmitigatedLoss: 14.2, mitigatedLoss: 9.8, baselineLoss: 8.7, networkAtRisk: 16.4 },
  { day: 'Day 30', unmitigatedLoss: 21.5, mitigatedLoss: 10.4, baselineLoss: 8.8, networkAtRisk: 22.8 },
  { day: 'Day 45', unmitigatedLoss: 24.8, mitigatedLoss: 11.1, baselineLoss: 8.9, networkAtRisk: 25.1 },
  { day: 'Day 60', unmitigatedLoss: 26.4, mitigatedLoss: 11.5, baselineLoss: 8.9, networkAtRisk: 26.4 },
  { day: 'Day 90', unmitigatedLoss: 26.4, mitigatedLoss: 11.8, baselineLoss: 9.0, networkAtRisk: 26.4 },
];

// Sector Exposure & Risk Breakdown
const SECTOR_EXPOSURE_DATA = [
  { sector: 'Logistics', directExposure: 184.2, indirectContagion: 62.4, avgRiskScore: 78, color: '#f43f5e' },
  { sector: 'FinTech / SaaS', directExposure: 210.5, indirectContagion: 34.1, avgRiskScore: 52, color: '#6366f1' },
  { sector: 'Renewables', directExposure: 162.8, indirectContagion: 18.2, avgRiskScore: 41, color: '#10b981' },
  { sector: 'Automotive', directExposure: 138.4, indirectContagion: 48.7, avgRiskScore: 68, color: '#f97316' },
  { sector: 'Infrastructure', directExposure: 96.7, indirectContagion: 22.5, avgRiskScore: 49, color: '#3b82f6' },
  { sector: 'Retail & FMCG', directExposure: 50.0, indirectContagion: 12.0, avgRiskScore: 36, color: '#8b5cf6' },
];

// Rating Distribution
const RATING_DISTRIBUTION = [
  { name: 'AAA / Low Risk', value: 38, count: 162, color: '#10b981' },
  { name: 'AA-A / Moderate', value: 32, count: 137, color: '#3b82f6' },
  { name: 'BBB / Watch', value: 18, count: 77, color: '#f59e0b' },
  { name: 'BB-B / High', value: 8, count: 34, color: '#f97316' },
  { name: 'Critical / Stressed', value: 4, count: 18, color: '#f43f5e' },
];

export const CommandCenter: React.FC = () => {
  const {
    kpis,
    propagation,
    recommendedIntervention,
    patterns,
    alerts,
    entities,
    setActiveView,
    setSelectedEntityId,
    setSelectedPatternId,
    runDefaultSimulation,
    isSimulatingPropagation,
    executeInterventionVector,
    acknowledgeAlert,
    dismissAlert,
    isLiveConnected,
  } = useRiskFlow();

  const [activeChartTab, setActiveChartTab] = useState<'contagion' | 'sectors' | 'ratings'>('contagion');
  const [shockRate, setShockRate] = useState<number>(150);
  const [supplyShock, setSupplyShock] = useState<number>(20);

  const activePattern = patterns.find((p) => p.code === 'Risk DNA #017') || patterns[0];
  const activeAlerts = alerts.filter((a) => a.status === 'active').slice(0, 4);

  // Dynamic stressed Expected Loss calculation based on quick shocks
  const baseEL = kpis?.expectedLoss || 31.4;
  const simulatedEL = (baseEL * (1 + (shockRate / 1000) * 1.8 + (supplyShock / 100) * 0.9)).toFixed(1);
  const simulatedDelta = (parseFloat(simulatedEL) - baseEL).toFixed(1);

  return (
    <div id="command-center-view" className="p-6 sm:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto overflow-y-auto bg-slate-50">
      {/* Top 4 Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          id="metric-total-exposure"
          label="Total Portfolio Exposure"
          value={`₹${kpis?.totalPortfolioExposure || 842.6} Cr`}
          delta={`+${kpis?.exposureGrowthPct || 2.4}%`}
          deltaType="increase"
          subValue="Across 428 active facilities"
          icon="account_balance"
          badge={isLiveConnected ? "LIVE" : "SYNCED"}
          badgeType="info"
        />
        <MetricCard
          id="metric-expected-loss"
          label="Expected Loss (Baseline)"
          value={`₹${kpis?.expectedLoss || 31.4} Cr`}
          delta="3.72% of portfolio"
          deltaType="neutral"
          subValue="Calibrated 1-yr horizon"
          icon="trending_down"
          badge="STABLE"
          badgeType="warning"
        />
        <MetricCard
          id="metric-high-risk"
          label="High-Risk Exposures"
          value={`${kpis?.highRiskExposures || 428} Units`}
          delta="+14 this week"
          deltaType="increase"
          subValue="Score >= 70 / Critical rating"
          icon="warning"
          badge="WATCH"
          badgeType="critical"
        />
        <MetricCard
          id="metric-indirect-network"
          label="Indirect Network Exposure"
          value={`₹${kpis?.indirectNetworkExposure || 117.8} Cr`}
          delta="14.0% contagion ratio"
          deltaType="increase"
          subValue="Cross-tier supplier & bank liens"
          icon="hub"
          badge="HIGH"
          badgeType="critical"
        />
      </div>

      {/* Interactive Charts & Analytics Section */}
      <Card className="shadow-xs border-slate-200">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-indigo-600">query_stats</span>
              <CardTitle>Portfolio Risk Dynamics & Contagion Analytics</CardTitle>
            </div>
            <CardDescription className="mt-0.5">
              Empirically calibrated loss projections, sector concentrations, and credit rating distributions.
            </CardDescription>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setActiveChartTab('contagion')}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                activeChartTab === 'contagion'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Contagion Trajectory
            </button>
            <button
              onClick={() => setActiveChartTab('sectors')}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                activeChartTab === 'sectors'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Sector Exposures
            </button>
            <button
              onClick={() => setActiveChartTab('ratings')}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                activeChartTab === 'ratings'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Rating Breakdown
            </button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {activeChartTab === 'contagion' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-rose-500" />
                    <span className="text-slate-700 font-semibold">Unmitigated Contagion Loss</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-indigo-500" />
                    <span className="text-slate-700 font-semibold">With Containment Protocol</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-slate-400" />
                    <span className="text-slate-500 font-semibold">Baseline Isolated Loss</span>
                  </div>
                </div>

                <Badge variant="low" size="sm">
                  ₹14.6 Cr Loss Avoided at Day 90
                </Badge>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={CONTAGION_TIMELINE_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="unmitigatedGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="mitigatedGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} unit=" Cr" />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        border: '1px solid #1e293b',
                        borderRadius: '0.75rem',
                        color: '#fff',
                        fontSize: '12px',
                      }}
                      formatter={(val: any) => [`₹${val} Cr`, '']}
                    />
                    <Area
                      type="monotone"
                      dataKey="unmitigatedLoss"
                      name="Unmitigated Cascade"
                      stroke="#f43f5e"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#unmitigatedGrad)"
                    />
                    <Area
                      type="monotone"
                      dataKey="mitigatedLoss"
                      name="With Containment"
                      stroke="#6366f1"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#mitigatedGrad)"
                    />
                    <Area
                      type="monotone"
                      dataKey="baselineLoss"
                      name="Isolated Baseline"
                      stroke="#94a3b8"
                      strokeWidth={1.5}
                      strokeDasharray="4 4"
                      fillOpacity={0}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeChartTab === 'sectors' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Sectoral Book Volume: Direct Portfolio Exposure vs Connected Contagion Exposure</span>
                <span className="font-semibold text-slate-700">Total Book: ₹842.6 Cr</span>
              </div>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={SECTOR_EXPOSURE_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="sector" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} unit=" Cr" />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        border: '1px solid #1e293b',
                        borderRadius: '0.75rem',
                        color: '#fff',
                        fontSize: '12px',
                      }}
                      formatter={(val: any) => [`₹${val} Cr`, '']}
                    />
                    <Legend />
                    <Bar dataKey="directExposure" name="Direct Exposure (₹ Cr)" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="indirectContagion" name="Indirect Contagion (₹ Cr)" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeChartTab === 'ratings' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-6 h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={RATING_DISTRIBUTION}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {RATING_DISTRIBUTION.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        border: '1px solid #1e293b',
                        borderRadius: '0.75rem',
                        color: '#fff',
                        fontSize: '12px',
                      }}
                      formatter={(val: any) => [`${val}% of Book`, '']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="md:col-span-6 space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Portfolio Credit Quality Distribution
                </h4>
                {RATING_DISTRIBUTION.map((r, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: r.color }} />
                      <span className="font-bold text-slate-800">{r.name}</span>
                    </div>
                    <div className="flex items-center gap-3 font-mono">
                      <span className="text-slate-500">{r.count} loans</span>
                      <span className="font-bold text-slate-900">{r.value}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Split: Default Propagation Traversal vs Recommended Intervention */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left (7 Cols): Default Propagation Traversal */}
        <Card className="lg:col-span-7 flex flex-col justify-between shadow-sm relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-lg">emergency_home</span>
              </div>
              <div>
                <CardTitle>Default Propagation Simulation</CardTitle>
                <CardDescription>Origin: Company A (Stressed Logistics Borrower)</CardDescription>
              </div>
            </div>

            <Button
              id="btn-re-simulate-propagation"
              variant="outline"
              size="sm"
              onClick={() => runDefaultSimulation('ent-comp-a')}
              disabled={isSimulatingPropagation}
              isLoading={isSimulatingPropagation}
              icon={<span className="material-symbols-outlined text-sm">play_arrow</span>}
            >
              Re-Simulate
            </Button>
          </CardHeader>

          <CardContent className="p-6 space-y-5">
            {/* Core Exposure Highlights */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <Tooltip term="Network Exposure">
                  <span className="text-[11px] font-bold text-slate-500 uppercase block tracking-wider cursor-help">
                    Total Network Exp ⓘ
                  </span>
                </Tooltip>
                <span className="text-xl font-bold font-mono text-rose-600">
                  ₹{propagation?.summary.networkExposure || 26.4} Cr
                </span>
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase block tracking-wider">Direct / Indirect</span>
                <span className="text-xs font-mono font-semibold text-slate-800 block mt-1">
                  ₹{propagation?.summary.directExposure || 8.7} Cr / ₹{propagation?.summary.indirectExposure || 17.7} Cr
                </span>
              </div>
              <div>
                <Tooltip term="Expected Loss">
                  <span className="text-[11px] font-bold text-slate-500 uppercase block tracking-wider cursor-help">
                    Est. Addl Loss ⓘ
                  </span>
                </Tooltip>
                <span className="text-xl font-bold font-mono text-rose-600">
                  ₹{propagation?.summary.estimatedAdditionalLoss || 6.8} Cr
                </span>
              </div>
            </div>

            {/* Timeline Propagation Cascade */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                <span>Propagation Timeline Traversal</span>
                <Badge variant="indigo" size="sm">
                  Depth: {propagation?.summary.propagationDepth || 3} Levels
                </Badge>
              </div>

              <div className="space-y-2.5">
                {propagation?.timeline.map((step, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/70 border border-slate-100 text-xs hover:border-slate-300 hover:bg-slate-50 transition-all"
                  >
                    <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100 shrink-0 mt-0.5">
                      DAY {step.day}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-slate-900 truncate">{step.title}</span>
                        <span className="font-mono text-xs font-bold text-amber-700 shrink-0">
                          ₹{step.exposureAtRisk} Cr
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed line-clamp-1">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>

          {/* Footer Action */}
          <div className="p-6 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">4 downstream high-risk nodes identified</span>
            <Button
              id="btn-view-in-network-graph"
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedEntityId('ent-comp-a');
                setActiveView('network');
              }}
              className="text-indigo-600 hover:text-indigo-800 font-bold"
            >
              Inspect in Network Graph
              <span className="material-symbols-outlined text-sm ml-1">arrow_forward</span>
            </Button>
          </div>
        </Card>

        {/* Right (5 Cols): Recommended Intervention Card */}
        <Card className="lg:col-span-5 border-indigo-100 ring-1 ring-indigo-500/10 flex flex-col justify-between shadow-sm relative">
          <CardContent className="p-6">
            {/* Header Badge */}
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-ping" />
                Recommended Containment Vector
              </span>
              <Badge variant="low" size="sm" className="font-mono font-bold">
                {recommendedIntervention?.confidence || 81}% Confidence
              </Badge>
            </div>

            {/* Target & Action */}
            <div className="mb-4">
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                {recommendedIntervention?.title || 'Protect Company B'}
              </h3>
              <p className="text-xs font-semibold text-indigo-600 mt-1">
                {recommendedIntervention?.actionName || 'Liquidity Bridge & Receivables Ring-Fencing'}
              </p>
            </div>

            {/* Efficiency Stats Grid */}
            <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100 mb-4">
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Avoided Loss</span>
                <span className="text-xl font-bold font-mono text-emerald-600">
                  ₹{recommendedIntervention?.avoidedLoss || 18.2} Cr
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">Downstream contagion</span>
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Cost to Intervene</span>
                <span className="text-xl font-bold font-mono text-amber-600">
                  ₹{recommendedIntervention?.costToIntervene || 4.1} Cr
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">Targeted liquidity injection</span>
              </div>
            </div>

            {/* Efficiency Ratio Banner */}
            <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-100 flex items-center justify-between mb-4">
              <div>
                <Tooltip term="Containment Efficiency">
                  <span className="text-xs font-bold text-indigo-950 block cursor-help">
                    Containment Efficiency ⓘ
                  </span>
                </Tooltip>
                <span className="text-xs text-indigo-700">Avoided loss vs intervention cost</span>
              </div>
              <div className="text-2xl font-bold font-mono text-emerald-600">
                {recommendedIntervention?.efficiencyRatio || 4.4}x
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              {recommendedIntervention?.description ||
                'Company B represents the highest-leverage transmission hub. Injecting targeted liquidity halts downstream failure to Company C and 8 tier-2 suppliers.'}
            </p>
          </CardContent>

          {/* Action Buttons */}
          <div className="p-6 pt-0 space-y-2.5 border-t border-slate-100 mt-auto">
            <Button
              id="btn-execute-containment-dashboard"
              variant="primary"
              size="lg"
              className="w-full mt-4"
              onClick={() => recommendedIntervention && executeInterventionVector(recommendedIntervention.id)}
              icon={<span className="material-symbols-outlined text-base">verified_user</span>}
            >
              Execute Containment Protocol
            </Button>
            <Button
              id="btn-view-all-containment-vectors"
              variant="outline"
              size="default"
              className="w-full"
              onClick={() => setActiveView('intervention')}
            >
              View All 3 Containment Vectors
            </Button>
          </div>
        </Card>
      </div>

      {/* Quick Interactive Scenario Stress Test Widget */}
      <Card className="shadow-xs border-slate-200">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-rose-600">tune</span>
              <CardTitle>Macroeconomic Stress Quick Simulator</CardTitle>
            </div>
            <CardDescription className="mt-0.5">
              Live sensitivity analysis of interest rate shocks and supply chain friction on expected portfolio default loss.
            </CardDescription>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Stressed Expected Loss</span>
              <span className="text-lg font-bold font-mono text-rose-600">
                ₹{simulatedEL} Cr <span className="text-xs font-sans text-rose-500">(+{simulatedDelta} Cr)</span>
              </span>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setActiveView('simulator');
              }}
            >
              Full Scenario Engine →
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700">RBI Repo Rate Shock:</span>
              <span className="font-mono font-bold text-indigo-600">+{shockRate} bps</span>
            </div>
            <input
              type="range"
              min="0"
              max="400"
              step="25"
              value={shockRate}
              onChange={(e) => setShockRate(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>0 bps (Current)</span>
              <span>+200 bps</span>
              <span>+400 bps (Severe)</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700">Supply Chain Friction / Payables Stretch:</span>
              <span className="font-mono font-bold text-rose-600">+{supplyShock}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="5"
              value={supplyShock}
              onChange={(e) => setSupplyShock(Number(e.target.value))}
              className="w-full accent-rose-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>0% (Baseline)</span>
              <span>+25% (Disrupted)</span>
              <span>+50% (Lockdown)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Critical Watchlist Facilities */}
      <Card className="shadow-xs border-slate-200">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-rose-600">shield_with_heart</span>
              <CardTitle>Top Critical Watchlist Borrowers</CardTitle>
            </div>
            <CardDescription className="mt-0.5">
              Facilities with highest systemic network contagion vulnerability and stress scores.
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveView('analysis')}
          >
            All 428 Facilities
          </Button>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Borrower Entity</th>
                <th className="py-3 px-4">Sector</th>
                <th className="py-3 px-4">Risk Rating</th>
                <th className="py-3 px-4 text-right">Direct Exposure</th>
                <th className="py-3 px-4 text-right">Contagion Risk</th>
                <th className="py-3 px-4 text-center">Score</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {entities.slice(0, 5).map((entity) => (
                <tr key={entity.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    <div className="flex items-center gap-2">
                      <span>{entity.name}</span>
                      {entity.id === 'ent-comp-a' && (
                        <span className="text-[10px] px-1.5 py-0.2 bg-rose-50 text-rose-700 border border-rose-200 rounded font-mono font-bold">
                          ORIGIN
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{entity.sector}</td>
                  <td className="py-3.5 px-4">
                    <RiskBadge band={entity.riskRating} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                    ₹{entity.directExposure} Cr
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-rose-600">
                    ₹{entity.indirectExposure} Cr
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-800">
                      {entity.score}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedEntityId(entity.id);
                          runDefaultSimulation(entity.id);
                        }}
                        title="Simulate Default"
                      >
                        Simulate
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelectedEntityId(entity.id);
                          setActiveView('network');
                        }}
                      >
                        Graph →
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Lower Section: Emerging Pattern Discovery & Alerts Triage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left (6 Cols): Emerging Risk Pattern Spotlight */}
        <Card className="lg:col-span-6 flex flex-col justify-between shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-600 text-lg">fingerprint</span>
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                Emerging Risk Pattern Discovery
              </span>
            </div>
            <Badge variant="destructive" size="sm">
              {activePattern?.code || 'Risk DNA #017'}
            </Badge>
          </CardHeader>

          <CardContent className="p-6">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              {activePattern?.title || 'Hidden Cash-Flow Stress'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              {activePattern?.description ||
                'Uncovered latent working capital compression where borrowers maintain acceptable headline credit scores while payables stretch past 75 days.'}
            </p>

            {/* Pattern Metrics Grid */}
            <div className="grid grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-center mb-4">
              <div>
                <span className="text-[11px] font-bold text-slate-500 block uppercase tracking-wider">Affected Loans</span>
                <span className="text-base font-bold font-mono text-slate-900">
                  {activePattern?.affectedLoansCount || 2143}
                </span>
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-500 block uppercase tracking-wider">Observed Default</span>
                <span className="text-base font-bold font-mono text-rose-600">
                  {activePattern?.observedDefaultRate || 14.8}%
                </span>
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-500 block uppercase tracking-wider">Model Gap</span>
                <span className="text-base font-bold font-mono text-rose-600">
                  +{activePattern?.modelGap || 8.6} pp
                </span>
              </div>
            </div>
          </CardContent>

          <div className="p-6 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Novelty Index: 0.88 / 1.0</span>
            <Button
              id="btn-inspect-risk-dna-pattern"
              variant="ghost"
              size="sm"
              onClick={() => {
                if (activePattern) setSelectedPatternId(activePattern.id);
                setActiveView('dna');
              }}
              className="text-indigo-600 hover:text-indigo-800 font-bold"
            >
              Inspect Risk DNA Pattern
              <span className="material-symbols-outlined text-sm ml-1">arrow_forward</span>
            </Button>
          </div>
        </Card>

        {/* Right (6 Cols): Real-time Alert Triage */}
        <Card className="lg:col-span-6 flex flex-col justify-between shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-indigo-600 text-lg">notifications_active</span>
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Real-Time Risk Alerts ({activeAlerts.length})
              </span>
            </div>
            <button
              id="btn-view-all-alerts"
              onClick={() => setActiveView('alerts')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
            >
              View All Alerts
            </button>
          </CardHeader>

          <CardContent className="p-6">
            {/* Alert List */}
            <div className="space-y-3">
              {activeAlerts.map((alert) => (
                <div
                  key={alert.id}
                  id={`alert-row-${alert.id}`}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start justify-between gap-3 text-xs hover:border-slate-200 transition-all"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <RiskBadge band={alert.severity} size="sm" />
                      <span className="font-bold text-slate-900 truncate">{alert.title}</span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-1">{alert.description}</p>
                    <span className="text-[10px] font-mono text-slate-400 mt-1 block">{alert.timestamp}</span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => acknowledgeAlert(alert.id)}
                      className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 cursor-pointer"
                      title="Acknowledge Alert"
                    >
                      <span className="material-symbols-outlined text-sm">check</span>
                    </button>
                    <button
                      onClick={() => dismissAlert(alert.id)}
                      className="p-1.5 rounded-lg bg-slate-100 text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 cursor-pointer"
                      title="Dismiss Alert"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>

          <div className="p-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Automated stream polling active</span>
            <span className="font-mono text-emerald-600 font-bold">● LOW LATENCY</span>
          </div>
        </Card>
      </div>
    </div>
  );
};

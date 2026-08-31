import React, { useState, useRef, useEffect } from 'react';
import { useRiskFlow } from '../../context/RiskFlowContext';
import { Entity, Relationship } from '../../types/riskflow';
import { RiskBadge } from '../common/RiskBadge';

export const RiskNetworkView: React.FC = () => {
  const {
    entities,
    relationships,
    selectedEntityId,
    setSelectedEntityId,
    selectedEntity,
    runDefaultSimulation,
    isSimulatingPropagation,
    setActiveView,
  } = useRiskFlow();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [minExposure, setMinExposure] = useState<number>(0);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [animatingShock, setAnimatingShock] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Position nodes nicely on SVG canvas
  const nodePositions: Record<string, { x: number; y: number }> = {
    'ent-comp-a': { x: 140, y: 130 },
    'ent-comp-b': { x: 300, y: 220 },
    'ent-comp-c': { x: 460, y: 120 },
    'ent-comp-d': { x: 260, y: 360 },
    'ent-comp-e': { x: 440, y: 340 },
    'ent-bank-x': { x: 240, y: 60 },
    'ent-portfolio-7': { x: 120, y: 300 },
    'ent-evergrande': { x: 640, y: 200 },
    'ent-shengjing': { x: 790, y: 120 },
    'ent-supplier-net-a': { x: 780, y: 290 },
    'ent-bondholders': { x: 920, y: 200 },
  };

  // Filtered nodes
  const filteredNodes = entities.filter((e) => {
    if (minExposure > 0 && e.totalExposure < minExposure) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!e.name.toLowerCase().includes(q) && !e.sector.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const nodeIds = new Set(filteredNodes.map((n) => n.id));

  // Filtered edges
  const filteredEdges = relationships.filter((r) => {
    if (!nodeIds.has(r.sourceId) || !nodeIds.has(r.targetId)) return false;
    if (filterType !== 'all' && r.relationshipType !== filterType) return false;
    return true;
  });

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).tagName === 'circle' || (e.target as HTMLElement).tagName === 'text') return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleSimulateFlow = async () => {
    setAnimatingShock(true);
    await runDefaultSimulation(selectedEntityId || 'ent-comp-a');
    setTimeout(() => {
      setAnimatingShock(false);
    }, 4000);
  };

  const activeNode = selectedEntity || entities[0];

  return (
    <div id="risk-network-view" className="h-[calc(100vh-4rem)] flex flex-col lg:flex-row overflow-hidden bg-slate-100">
      {/* Center/Left Main Graph Canvas */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Top Floating Graph Toolbar */}
        <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-3 bg-white/95 backdrop-blur-md border border-slate-200 p-3.5 rounded-2xl shadow-md">
          {/* Search Node */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs">
            <span className="material-symbols-outlined text-sm text-slate-400">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search node..."
              className="bg-transparent border-none text-slate-900 focus:outline-none w-28 sm:w-36 text-xs placeholder-slate-400"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-700">
                <span className="material-symbols-outlined text-xs">close</span>
              </button>
            )}
          </div>

          {/* Relationship Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-bold text-[10px] uppercase tracking-wider hidden sm:inline">Edge:</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none font-medium"
            >
              <option value="all">All Relationships</option>
              <option value="supplier_dependency">Supplier Dependency</option>
              <option value="loan_exposure">Loan Exposure</option>
              <option value="ownership">Cross Ownership</option>
            </select>
          </div>

          {/* Exposure Slider */}
          <div className="hidden md:flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-bold text-[10px] uppercase tracking-wider">Min Exp:</span>
            <input
              type="range"
              min="0"
              max="50"
              step="5"
              value={minExposure}
              onChange={(e) => setMinExposure(parseFloat(e.target.value))}
              className="w-20 accent-indigo-600"
            />
            <span className="font-mono font-bold text-xs text-indigo-600">₹{minExposure} Cr</span>
          </div>

          {/* Controls: Zoom, Pan & Simulate */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setZoomLevel((z) => Math.min(2.0, z + 0.15))}
              className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900"
              title="Zoom In"
            >
              <span className="material-symbols-outlined text-sm">zoom_in</span>
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.5, z - 0.15))}
              className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900"
              title="Zoom Out"
            >
              <span className="material-symbols-outlined text-sm">zoom_out</span>
            </button>
            <button
              onClick={() => {
                setZoomLevel(1);
                setPanOffset({ x: 0, y: 0 });
              }}
              className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900"
              title="Reset Zoom"
            >
              <span className="material-symbols-outlined text-sm">center_focus_strong</span>
            </button>

            <button
              id="btn-simulate-network-flow"
              onClick={handleSimulateFlow}
              disabled={isSimulatingPropagation || animatingShock}
              className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all ml-1"
            >
              <span className={`material-symbols-outlined text-sm ${animatingShock ? 'animate-spin' : ''}`}>
                {animatingShock ? 'refresh' : 'play_circle'}
              </span>
              <span>Simulate Default Flow</span>
            </button>
          </div>
        </div>

        {/* SVG Interactive Canvas */}
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className="flex-1 w-full h-full cursor-grab active:cursor-grabbing bg-slate-900 overflow-hidden relative flex items-center justify-center select-none"
        >
          <svg
            className="w-full h-full"
            style={{
              transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
              transformOrigin: 'center center',
              transition: isDragging ? 'none' : 'transform 0.15s ease-out',
            }}
            viewBox="0 0 1050 480"
          >
            {/* Defs for markers and filters */}
            <defs>
              <marker
                id="arrow-default"
                viewBox="0 0 10 10"
                refX="22"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#818cf8" fillOpacity="0.8" />
              </marker>
              <marker
                id="arrow-shock"
                viewBox="0 0 10 10"
                refX="22"
                refY="5"
                markerWidth="7"
                markerHeight="7"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#f43f5e" />
              </marker>
              <radialGradient id="glow-critical" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#9f1239" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Edge Lines */}
            {filteredEdges.map((edge) => {
              const src = nodePositions[edge.sourceId] || { x: 100, y: 100 };
              const tgt = nodePositions[edge.targetId] || { x: 200, y: 200 };
              const isShockedEdge = animatingShock && (edge.sourceId === 'ent-comp-a' || edge.sourceId === 'ent-comp-b');

              const strokeColor = isShockedEdge
                ? '#f43f5e'
                : edge.relationshipType === 'supplier_dependency'
                ? '#818cf8'
                : edge.relationshipType === 'ownership'
                ? '#fbbf24'
                : '#475569';

              const midX = (src.x + tgt.x) / 2;
              const midY = (src.y + tgt.y) / 2;

              return (
                <g key={edge.id}>
                  {/* Background shadow line */}
                  <line
                    x1={src.x}
                    y1={src.y}
                    x2={tgt.x}
                    y2={tgt.y}
                    stroke={strokeColor}
                    strokeWidth={isShockedEdge ? 3.5 : 1.8}
                    strokeDasharray={isShockedEdge ? '6 3' : 'none'}
                    markerEnd={isShockedEdge ? 'url(#arrow-shock)' : 'url(#arrow-default)'}
                    className={isShockedEdge ? 'animate-pulse' : ''}
                  />

                  {/* Edge Exposure Badge */}
                  <rect
                    x={midX - 24}
                    y={midY - 9}
                    width={48}
                    height={18}
                    rx={4}
                    fill="#0f172a"
                    stroke={strokeColor}
                    strokeWidth={1}
                    fillOpacity={0.9}
                  />
                  <text
                    x={midX}
                    y={midY + 3.5}
                    textAnchor="middle"
                    fill="#f1f5f9"
                    fontSize="9"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    ₹{edge.exposure} Cr
                  </text>
                </g>
              );
            })}

            {/* Entity Nodes */}
            {filteredNodes.map((entity) => {
              const pos = nodePositions[entity.id] || { x: 200, y: 200 };
              const isSelected = selectedEntityId === entity.id;
              const isCritical = entity.riskScore >= 80;
              const isHigh = entity.riskScore >= 70;
              const isWatch = entity.riskScore >= 55;

              const nodeRadius = Math.min(32, Math.max(20, 18 + Math.log(entity.totalExposure + 1) * 3.5));

              const fillColor = isCritical
                ? '#881337'
                : isHigh
                ? '#78350f'
                : isWatch
                ? '#1e3a8a'
                : '#064e3b';

              const strokeColor = isCritical
                ? '#fb7185'
                : isHigh
                ? '#fbbf24'
                : isWatch
                ? '#818cf8'
                : '#34d399';

              return (
                <g
                  key={entity.id}
                  id={`network-node-${entity.id}`}
                  onClick={() => setSelectedEntityId(entity.id)}
                  className="cursor-pointer transition-transform duration-200 group"
                  transform={`translate(${pos.x}, ${pos.y})`}
                >
                  {/* Outer selection ring / shock pulse */}
                  {(isSelected || (animatingShock && isCritical)) && (
                    <circle
                      r={nodeRadius + 10}
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth="2"
                      strokeOpacity="0.4"
                      className="animate-ping"
                    />
                  )}

                  {/* Main Node Circle */}
                  <circle
                    r={nodeRadius}
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth={isSelected ? 3.5 : 2}
                    fillOpacity={0.9}
                    className="group-hover:stroke-white transition-all shadow-xl"
                  />

                  {/* Entity Name Label Inside/Below */}
                  <text
                    y={-nodeRadius - 6}
                    textAnchor="middle"
                    fill="#f8fafc"
                    fontSize="11"
                    fontFamily="sans-serif"
                    fontWeight="bold"
                    className="pointer-events-none drop-shadow"
                  >
                    {entity.name}
                  </text>

                  {/* Risk Score Inside Circle */}
                  <text
                    y={4}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="11"
                    fontFamily="monospace"
                    fontWeight="bold"
                    className="pointer-events-none"
                  >
                    {entity.riskScore}
                  </text>

                  {/* Exposure Underneath */}
                  <text
                    y={nodeRadius + 14}
                    textAnchor="middle"
                    fill="#94a3b8"
                    fontSize="9"
                    fontFamily="monospace"
                    className="pointer-events-none"
                  >
                    ₹{entity.totalExposure} Cr
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Bottom Legend */}
        <div className="absolute bottom-4 left-4 z-10 flex items-center gap-4 bg-white/95 backdrop-blur-md border border-slate-200 px-4 py-2 rounded-xl text-[11px] font-bold text-slate-700 shadow-md">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
            <span>CRITICAL (&ge;80)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
            <span>HIGH (70-79)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
            <span>WATCH (55-69)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span>LOW (&lt;55)</span>
          </div>
        </div>
      </div>

      {/* Right Inspection Drawer: Critical Node Breakdown */}
      <div
        id="critical-node-panel"
        className="w-full lg:w-96 bg-white border-t lg:border-t-0 lg:border-l border-slate-200 p-6 flex flex-col justify-between overflow-y-auto shrink-0 space-y-5 shadow-sm"
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-indigo-600">account_circle</span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Node Inspection // {activeNode.country}
              </span>
            </div>
            <RiskBadge band={activeNode.riskRating} size="md" />
          </div>

          {/* Node Identity */}
          <div className="mb-4">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">{activeNode.name}</h2>
            <p className="text-xs text-slate-500 mt-0.5">{activeNode.sector} • {activeNode.region}</p>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100 mb-4">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase block tracking-wider">Total Exposure</span>
              <span className="text-xl font-bold font-mono text-slate-900">
                ₹{activeNode.totalExposure} Cr
              </span>
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase block tracking-wider">Risk Score / PD</span>
              <span className="text-xl font-bold font-mono text-rose-600">
                {activeNode.riskScore} / {activeNode.pd}%
              </span>
            </div>
          </div>

          {/* Direct vs Indirect Exposure Breakdown */}
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-500">Direct Exposure</span>
              <span className="font-mono text-slate-900 font-bold">₹{activeNode.directExp} Cr</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full"
                style={{ width: `${(activeNode.directExp / (activeNode.totalExposure || 1)) * 100}%` }}
              />
            </div>

            <div className="flex justify-between text-xs font-medium mt-2">
              <span className="text-slate-500">Indirect / Contagion Exposure</span>
              <span className="font-mono text-amber-600 font-bold">₹{activeNode.indirectExp} Cr</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full"
                style={{ width: `${(activeNode.indirectExp / (activeNode.totalExposure || 1)) * 100}%` }}
              />
            </div>
          </div>

          {/* Description */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 mb-4 text-xs text-slate-600 leading-relaxed">
            {activeNode.description}
          </div>

          {/* Latest Risk Events */}
          {activeNode.latestEvents && activeNode.latestEvents.length > 0 && (
            <div className="space-y-2.5 mb-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Latest Risk Events
              </span>
              <div className="space-y-2">
                {activeNode.latestEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          ev.severity === 'critical'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {ev.severity}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{ev.timeAgo}</span>
                    </div>
                    <p className="text-slate-800 font-medium leading-snug">{ev.headline}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="space-y-2.5 pt-4 border-t border-slate-100">
          <button
            id="btn-inspect-dna-from-node"
            onClick={() => {
              setActiveView('dna');
            }}
            className="w-full py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-xs font-bold text-indigo-700 flex items-center justify-center gap-1.5 transition-all shadow-xs"
          >
            <span className="material-symbols-outlined text-sm">fingerprint</span>
            View 9D Risk DNA Profile
          </button>
          <button
            id="btn-simulate-default-from-node"
            onClick={handleSimulateFlow}
            className="w-full py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-xs font-bold text-rose-700 flex items-center justify-center gap-1.5 transition-all shadow-xs"
          >
            <span className="material-symbols-outlined text-sm">play_arrow</span>
            Simulate Propagation from this Node
          </button>
        </div>
      </div>
    </div>
  );
};

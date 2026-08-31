import React, { useState, useEffect } from 'react';
import { useRiskFlow } from '../../context/RiskFlowContext';
import { RiskBadge } from './RiskBadge';

export const GlobalSearchModal: React.FC = () => {
  const {
    searchModalOpen,
    setSearchModalOpen,
    entities,
    patterns,
    interventions,
    setSelectedEntityId,
    setSelectedPatternId,
    setActiveView,
  } = useRiskFlow();

  const [query, setQuery] = useState('');

  // Keyboard shortcut listener (Cmd+K / Ctrl+K and Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen(true);
      }
      if (e.key === 'Escape' && searchModalOpen) {
        setSearchModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchModalOpen, setSearchModalOpen]);

  if (!searchModalOpen) return null;

  const q = query.toLowerCase().trim();

  const matchedEntities = entities.filter(
    (e) => !q || e.name.toLowerCase().includes(q) || e.sector.toLowerCase().includes(q) || e.region.toLowerCase().includes(q)
  );

  const matchedPatterns = patterns.filter(
    (p) => !q || p.code.toLowerCase().includes(q) || p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
  );

  const matchedInterventions = interventions.filter(
    (i) => !q || i.title.toLowerCase().includes(q) || i.targetEntityName.toLowerCase().includes(q)
  );

  const handleSelectEntity = (id: string) => {
    setSelectedEntityId(id);
    setActiveView('network');
    setSearchModalOpen(false);
  };

  const handleSelectPattern = (id: string) => {
    setSelectedPatternId(id);
    setActiveView('dna');
    setSearchModalOpen(false);
  };

  const handleSelectIntervention = () => {
    setActiveView('intervention');
    setSearchModalOpen(false);
  };

  return (
    <div
      id="global-search-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-start justify-center pt-20 p-4"
      onClick={() => setSearchModalOpen(false)}
    >
      <div
        id="global-search-modal-content"
        className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[75vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Box */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3 bg-slate-50">
          <span className="material-symbols-outlined text-indigo-600">search</span>
          <input
            id="input-global-search"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type to search entities, loans, risk patterns, containment vectors..."
            className="w-full bg-transparent border-none text-sm text-slate-900 focus:outline-none placeholder-slate-400"
            autoFocus
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-slate-400 hover:text-slate-700">
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          )}
          <span className="text-[10px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200 shadow-xs">
            ESC
          </span>
        </div>

        {/* Search Results */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* Entities Section */}
          {matchedEntities.length > 0 && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-2">
                Entities & Borrowers ({matchedEntities.length})
              </div>
              <div className="space-y-1">
                {matchedEntities.slice(0, 6).map((entity) => (
                  <button
                    key={entity.id}
                    id={`search-item-entity-${entity.id}`}
                    onClick={() => handleSelectEntity(entity.id)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all text-left group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover:text-indigo-600 group-hover:bg-indigo-50 shrink-0">
                        <span className="material-symbols-outlined text-base">business</span>
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate">{entity.name}</div>
                        <div className="text-[11px] text-slate-500 truncate">{entity.sector} • {entity.region}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs font-mono font-semibold text-slate-900">₹{entity.totalExposure} Cr</span>
                      <RiskBadge band={entity.riskRating} size="sm" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Risk Patterns Section */}
          {matchedPatterns.length > 0 && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-2">
                Risk DNA & Patterns ({matchedPatterns.length})
              </div>
              <div className="space-y-1">
                {matchedPatterns.slice(0, 4).map((pattern) => (
                  <button
                    key={pattern.id}
                    id={`search-item-pattern-${pattern.id}`}
                    onClick={() => handleSelectPattern(pattern.id)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all text-left group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover:text-indigo-600 group-hover:bg-indigo-50 shrink-0">
                        <span className="material-symbols-outlined text-base">fingerprint</span>
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate">
                          {pattern.code}: {pattern.title}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">
                          {pattern.affectedLoansCount} loans affected • Observed Default: {pattern.observedDefaultRate}%
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                      +{pattern.modelGap} pp gap
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Interventions Section */}
          {matchedInterventions.length > 0 && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-2">
                Containment Vectors ({matchedInterventions.length})
              </div>
              <div className="space-y-1">
                {matchedInterventions.map((intv) => (
                  <button
                    key={intv.id}
                    id={`search-item-intv-${intv.id}`}
                    onClick={() => handleSelectIntervention()}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all text-left group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover:text-indigo-600 group-hover:bg-indigo-50 shrink-0">
                        <span className="material-symbols-outlined text-base">shield</span>
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate">{intv.title}</div>
                        <div className="text-[11px] text-slate-500 truncate">{intv.actionName}</div>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-600">
                      {intv.efficiencyRatio}x EV
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {matchedEntities.length === 0 && matchedPatterns.length === 0 && matchedInterventions.length === 0 && (
            <div className="p-8 text-center text-slate-400 text-xs">
              No matching records found for "{query}".
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

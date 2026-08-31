import React, { useState, useEffect, ChangeEvent, KeyboardEvent } from 'react';
import { useRiskFlow } from '../../context/RiskFlowContext';
import { api } from '../../services/api';
import { AiAnalystResponse } from '../../types/riskflow';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';

export const AiRiskAnalystView: React.FC = () => {
  const { selectedEntityId, selectedEntity } = useRiskFlow();

  const [queryInput, setQueryInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<AiAnalystResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [aiStatus, setAiStatus] = useState<{
    provider: 'groq';
    isConfigured: boolean;
    model: string;
    statusText: string;
  } | null>(null);

  useEffect(() => {
    api.getAiStatus()
      .then((res) => setAiStatus(res))
      .catch(() => {});
  }, []);

  const samplePrompts = [
    'Why is Company B becoming risky?',
    'What happens if Loan #8291 defaults?',
    'Where is our portfolio most exposed?',
    'What new risk patterns appeared this quarter?',
    'Which intervention prevents the most loss?',
    'Why did this entity become high risk?',
    'Explain the propagation path.',
    'Explain the second-order exposure.',
    'Why is this intervention recommended?',
  ];

  const handleRunQuery = async (queryText: string) => {
    if (!queryText.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.queryAiAnalyst(queryText, selectedEntityId);
      setResponse(res);
    } catch (err: any) {
      setError(err.message || 'AI Risk Analyst is temporarily unavailable. Underlying RiskFlow analysis remains available.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="ai-risk-analyst-view" className="p-6 space-y-6 max-w-5xl mx-auto overflow-y-auto">
      {/* Header with Groq Status Indicator */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-indigo-600">auto_awesome</span>
              <CardTitle>Institutional AI Risk Analyst</CardTitle>
            </div>
            <CardDescription className="mt-0.5">
              Evidence-grounded explanations powered exclusively by Groq LPU inference.
            </CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Groq Connection Status Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">AI Provider:</span>
              <span className="font-bold text-slate-900">Groq</span>
              {aiStatus?.isConfigured ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Groq Connected
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  Groq Not Configured
                </span>
              )}
            </div>

            <Badge variant="indigo" size="default" className="shadow-xs font-mono">
              Entity Context: {selectedEntity?.name || 'Company A'}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Query Input Box */}
      <Card>
        <CardContent className="p-5 space-y-3.5">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-slate-400">chat</span>
            <input
              id="input-ai-analyst-query"
              type="text"
              value={queryInput}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setQueryInput(e.target.value)}
              onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                if (e.key === 'Enter') handleRunQuery(queryInput);
              }}
              placeholder="Ask about default propagation, second-order exposure, or intervention efficiency..."
              className="flex-1 bg-transparent border-none text-sm text-slate-900 focus:outline-none placeholder:text-slate-400 font-medium"
            />
            <Button
              id="btn-submit-ai-query"
              variant="primary"
              size="default"
              onClick={() => handleRunQuery(queryInput)}
              disabled={isLoading || !queryInput.trim()}
              isLoading={isLoading}
              icon={<span className="material-symbols-outlined text-sm">send</span>}
            >
              Analyze
            </Button>
          </div>

          {/* Quick Prompt Pills */}
          <div className="space-y-2 pt-3 border-t border-slate-100">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Supported Inquiries:</span>
            <div className="flex flex-wrap gap-1.5">
              {samplePrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQueryInput(prompt);
                    handleRunQuery(prompt);
                  }}
                  className="text-xs px-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors font-medium shadow-xs cursor-pointer text-left"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Banner */}
      {error && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold shadow-xs flex items-center gap-2">
          <span className="material-symbols-outlined text-base text-amber-600">info</span>
          <span>{error}</span>
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading && (
        <Card className="animate-pulse p-6 space-y-4">
          <div className="h-6 bg-slate-200/80 rounded-xl w-1/3" />
          <div className="h-20 bg-slate-100 rounded-xl" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="h-16 bg-slate-100 rounded-xl" />
            <div className="h-16 bg-slate-100 rounded-xl" />
            <div className="h-16 bg-slate-100 rounded-xl" />
            <div className="h-16 bg-slate-100 rounded-xl" />
          </div>
        </Card>
      )}

      {/* Structured AI Response View */}
      {!isLoading && response && (
        <Card className="border-indigo-100 shadow-xs">
          <CardContent className="p-6 space-y-6">
            {/* Header: Query & Model Badge */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <span className="text-xs text-slate-500 font-medium">QUERY: "{response.query}"</span>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" size="sm" className="font-mono uppercase">
                  Engine: Groq ({response.modelUsed || 'llama-3.3-70b-versatile'})
                </Badge>
                <Badge variant="low" size="sm" className="font-mono">
                  {Math.round(response.confidence * 100)}% CONFIDENCE
                </Badge>
              </div>
            </div>

            {/* 1. SUMMARY */}
            <div>
              <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider block mb-2">
                Summary & Executive Diagnostics
              </span>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <p className="text-sm text-slate-800 leading-relaxed font-medium whitespace-pre-line">
                  {response.summary}
                </p>
              </div>
            </div>

            {/* 2. RISK DRIVERS */}
            {response.riskDrivers && response.riskDrivers.length > 0 && (
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2.5">
                  Identified Risk Drivers
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {response.riskDrivers.map((driver, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-rose-50/50 border border-rose-100 text-xs flex items-start gap-2 text-rose-950 font-medium"
                    >
                      <span className="material-symbols-outlined text-rose-500 text-sm mt-0.5">priority_high</span>
                      <span>{driver}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. KEY METRICS */}
            {response.metrics && response.metrics.length > 0 && (
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2.5">
                  Key Quantitative Metrics
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  {response.metrics.map((m, idx) => (
                    <div key={idx}>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">{m.label}</span>
                      <span className="text-base font-bold font-mono text-slate-900 mt-0.5 block">{m.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. VERIFIED EVIDENCE CITATIONS */}
            {response.evidence && response.evidence.length > 0 && (
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">
                  Verified Evidence Citations
                </span>
                <div className="space-y-2">
                  {response.evidence.map((ev, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="default" size="sm" className="font-mono font-bold">
                            {ev.id}
                          </Badge>
                          <span className="font-bold text-slate-900">{ev.title}</span>
                          <span className="text-[10px] font-mono text-slate-400 uppercase">({ev.type})</span>
                        </div>
                        <p className="text-slate-600 font-medium">{ev.claim}</p>
                      </div>

                      {ev.metric && (
                        <Badge variant="watch" size="sm" className="font-mono shrink-0">
                          {ev.metric}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. AFFECTED ENTITIES */}
            {response.affectedEntities && response.affectedEntities.length > 0 && (
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Affected Entities & Network Nodes
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {response.affectedEntities.map((ent, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs flex items-center justify-between"
                    >
                      <span className="font-bold text-slate-900">{ent.name}</span>
                      <span className="text-xs text-slate-500 font-medium">{ent.riskImpact}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. RECOMMENDATION & STRATEGIC VERDICT */}
            <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 space-y-2">
              <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider block">
                Recommendation & Strategic Verdict
              </span>
              <p className="text-xs text-slate-800 leading-relaxed font-semibold">
                {response.conclusion}
              </p>
              <div className="pt-2 border-t border-indigo-100 flex items-start gap-2 text-indigo-900 font-bold text-xs">
                <span className="material-symbols-outlined text-sm text-indigo-600 mt-0.5">verified_user</span>
                <span>Action: {response.recommendation}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!isLoading && !response && (
        <Card className="p-12 text-center space-y-3">
          <span className="material-symbols-outlined text-4xl text-slate-400">psychology</span>
          <h3 className="text-sm font-bold text-slate-900">Ask RiskFlow Intelligence</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Select a question above or enter a custom prompt. RiskFlow's deterministic risk engine collects structured evidence tensors and sends them to Groq for institutional analysis.
          </p>
        </Card>
      )}
    </div>
  );
};

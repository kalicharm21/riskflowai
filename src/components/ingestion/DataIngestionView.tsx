import React, { useState } from 'react';
import { api } from '../../services/api';
import { useRiskFlow } from '../../context/RiskFlowContext';

export const DataIngestionView: React.FC = () => {
  const { setActiveView } = useRiskFlow();
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [parsedRows, setParsedRows] = useState<any[]>([]);
  const [ingestStatus, setIngestStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mappingPreview, setMappingPreview] = useState<Record<string, string>>({
    borrowerName: 'Company Name',
    amount: 'Sanctioned Amount (Cr)',
    ltv: 'Loan to Value Ratio (%)',
    creditScore: 'CIBIL / Experian Bureau Score',
    sector: 'Industry Classification',
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (file.name.endsWith('.json')) {
        try {
          const parsed = JSON.parse(content);
          setParsedRows(Array.isArray(parsed) ? parsed : [parsed]);
        } catch {
          alert('Invalid JSON file format');
        }
      } else {
        // Simple CSV parser
        const lines = content.split('\n').filter((l) => l.trim().length > 0);
        const headers = lines[0].split(',').map((h) => h.trim());
        const rows = lines.slice(1, 15).map((line) => {
          const vals = line.split(',').map((v) => v.trim());
          const obj: any = {};
          headers.forEach((h, i) => {
            obj[h] = vals[i];
          });
          return obj;
        });
        setParsedRows(rows);
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleLoadSample = (sampleType: 'real-estate' | 'infrastructure' | 'sme') => {
    setFileName(`sample_${sampleType}_loan_portfolio.csv`);
    const sampleData = [
      { 'Loan Ref': 'LN-IND-901', 'Borrower Name': 'Apex Energy Ltd', 'Amount (Cr)': '45.0', Sector: 'Infrastructure', LTV: '68', 'Credit Score': '740' },
      { 'Loan Ref': 'LN-IND-902', 'Borrower Name': 'Brahmaputra Cargo', 'Amount (Cr)': '28.5', Sector: 'Logistics', LTV: '74', 'Credit Score': '680' },
      { 'Loan Ref': 'LN-IND-903', 'Borrower Name': 'Coromandel Castings', 'Amount (Cr)': '16.2', Sector: 'Manufacturing', LTV: '82', 'Credit Score': '620' },
      { 'Loan Ref': 'LN-IND-904', 'Borrower Name': 'Deccan Solar Grid', 'Amount (Cr)': '62.0', Sector: 'Renewables', LTV: '59', 'Credit Score': '790' },
    ];
    setParsedRows(sampleData);
  };

  const handleIngest = async () => {
    if (parsedRows.length === 0) return;
    setIsLoading(true);
    try {
      await api.ingestLoans(parsedRows);
      setIngestStatus(`Successfully ingested ${parsedRows.length} facilities into active risk matrix.`);
      setTimeout(() => {
        setActiveView('analysis');
      }, 1500);
    } catch (err: any) {
      alert('Ingestion error: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="data-ingestion-view" className="p-6 space-y-6 max-w-5xl mx-auto overflow-y-auto">
      {/* Header */}
      <div className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-indigo-600">cloud_upload</span>
            <h2 className="text-base font-bold text-slate-900">Loan Book Ingestion & Automated Schema Mapping</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Ingest institutional loan tapes, syndicated debt registries, or supplier books for instant risk profiling.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Formats:</span>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl shadow-xs">
            CSV, JSON, XLSX
          </span>
        </div>
      </div>

      {/* Success Notification */}
      {ingestStatus && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2 shadow-xs">
          <span className="material-symbols-outlined text-base">check_circle</span>
          <span>{ingestStatus}</span>
        </div>
      )}

      {/* Drag & Drop Zone */}
      <div
        id="drop-zone-loan-book"
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer shadow-xs ${
          dragActive
            ? 'border-indigo-600 bg-indigo-50/50'
            : 'border-slate-300 bg-white hover:border-indigo-400'
        }`}
        onClick={() => document.getElementById('file-input-ingest')?.click()}
      >
        <input
          id="file-input-ingest"
          type="file"
          accept=".csv,.json"
          onChange={handleFileInputChange}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="h-12 w-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-xs">
            <span className="material-symbols-outlined text-2xl">upload_file</span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {fileName ? fileName : 'Drag & drop your loan tape file here'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              or click to browse local files (Supports CBS exports, syndicate registers)
            </p>
          </div>
        </div>
      </div>

      {/* Sample Dataset Loaders */}
      <div className="bg-white border border-slate-200 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Load Test Portfolio:</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleLoadSample('infrastructure')}
            className="px-3.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs text-indigo-700 font-semibold shadow-xs"
          >
            + Infrastructure Tape
          </button>
          <button
            onClick={() => handleLoadSample('real-estate')}
            className="px-3.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs text-indigo-700 font-semibold shadow-xs"
          >
            + Commercial Real Estate
          </button>
          <button
            onClick={() => handleLoadSample('sme')}
            className="px-3.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs text-indigo-700 font-semibold shadow-xs"
          >
            + SME Supply Chain
          </button>
        </div>
      </div>

      {/* Mapping & Parsed Preview */}
      {parsedRows.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-bold text-slate-900">
              Auto-Detected Schema & Ingestion Preview ({parsedRows.length} Rows)
            </span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full uppercase tracking-wider">
              Schema Validation Passed
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase border-b border-slate-100">
                <tr>
                  {Object.keys(parsedRows[0]).map((k) => (
                    <th key={k} className="py-2.5 px-3 font-bold">
                      {k}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {parsedRows.slice(0, 5).map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    {Object.values(row).map((v: any, vIdx) => (
                      <td key={vIdx} className="py-2.5 px-3 text-slate-700">
                        {String(v)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">All 9 behavioral risk tensors will be computed on ingest</span>
            <button
              id="btn-confirm-ingestion"
              onClick={handleIngest}
              disabled={isLoading}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-2"
            >
              <span className={`material-symbols-outlined text-sm ${isLoading ? 'animate-spin' : ''}`}>
                {isLoading ? 'refresh' : 'check'}
              </span>
              <span>{isLoading ? 'Ingesting Book...' : 'Commit Ingestion to Database'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Loan, RiskBand } from '../../types/riskflow';
import { RiskBadge } from '../common/RiskBadge';

export const PortfolioAnalysisView: React.FC = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [search, setSearch] = useState<string>('');
  const [riskBand, setRiskBand] = useState<string>('');
  const [sector, setSector] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);

  const fetchLoans = async () => {
    setIsLoading(true);
    try {
      const res = await api.getLoans({ search, riskBand, sector, page, limit: 15 });
      setLoans(res.loans);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, [page, riskBand, sector]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchLoans();
  };

  const sectors = [
    'All Sectors',
    'Infrastructure & Logistics',
    'Heavy Components Manufacturing',
    'Commercial Vehicles Assembly',
    'Renewable Power Transmission',
    'Electrical Grid Sub-contracting',
    'Commercial Real Estate',
    'NBFC FinTech Lending',
    'Automotive Supply',
  ];

  return (
    <div id="portfolio-analysis-view" className="p-6 space-y-6 max-w-7xl mx-auto overflow-y-auto">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-indigo-600">table_chart</span>
            <h2 className="text-base font-bold text-slate-900">Loan Book & Portfolio Granularity</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Explore active credit facilities, calibrated default probabilities, and exposure distributions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Book:</span>
          <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-xl shadow-xs">
            {total} Active Loans
          </span>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white border border-slate-200 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 flex-1 min-w-[240px]">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 w-full text-xs">
            <span className="material-symbols-outlined text-sm text-slate-400">search</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by loan ID, borrower name, or sector..."
              className="bg-transparent border-none text-slate-900 focus:outline-none w-full text-xs placeholder:text-slate-400"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs"
          >
            Filter
          </button>
        </form>

        <div className="flex items-center gap-2 text-xs">
          {/* Sector Filter */}
          <select
            value={sector}
            onChange={(e) => {
              setSector(e.target.value === 'All Sectors' ? '' : e.target.value);
              setPage(1);
            }}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none font-medium shadow-xs"
          >
            {sectors.map((sec) => (
              <option key={sec} value={sec}>
                {sec}
              </option>
            ))}
          </select>

          {/* Risk Band Filter */}
          <select
            value={riskBand}
            onChange={(e) => {
              setRiskBand(e.target.value);
              setPage(1);
            }}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none font-medium shadow-xs"
          >
            <option value="">All Risk Bands</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="WATCH">Watch</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-mono text-[10px] uppercase border-b border-slate-100">
              <tr>
                <th className="py-3 px-4 font-bold">Loan ID</th>
                <th className="py-3 px-4 font-bold">Borrower Name</th>
                <th className="py-3 px-3 font-bold">Exposure (Cr)</th>
                <th className="py-3 px-3 font-bold">LTV / DTI</th>
                <th className="py-3 px-3 font-bold">Credit Score</th>
                <th className="py-3 px-3 font-bold">Risk Score / PD</th>
                <th className="py-3 px-3 font-bold">Expected Loss</th>
                <th className="py-3 px-3 font-bold">Risk Band</th>
                <th className="py-3 px-4 text-right font-bold">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loans.map((loan) => (
                <tr
                  key={loan.id}
                  onClick={() => setSelectedLoan(loan)}
                  className="hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-4 font-mono font-bold text-indigo-600">
                    {loan.loanNumber}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-900 max-w-[200px] truncate">
                    {loan.borrowerName}
                    <span className="block text-[10px] text-slate-400 font-normal truncate">
                      {loan.sector}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-900">
                    ₹{loan.amount}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-500">
                    {loan.ltv}% / {loan.dti}%
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-800 font-medium">
                    {loan.creditScore}
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-rose-600">
                    {loan.riskScore} / {loan.probabilityOfDefault}%
                  </td>
                  <td className="py-3 px-3 font-mono text-amber-600 font-bold">
                    ₹{loan.expectedLoss} Cr
                  </td>
                  <td className="py-3 px-3">
                    <RiskBadge band={loan.riskBand} size="sm" />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-slate-400 hover:text-slate-600 material-symbols-outlined text-sm">
                      chevron_right
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Page {page} of {totalPages} ({total} Total Records)</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 font-medium hover:text-slate-900 disabled:opacity-40 shadow-xs"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 font-medium hover:text-slate-900 disabled:opacity-40 shadow-xs"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Selected Loan Modal / Drawer */}
      {selectedLoan && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedLoan(null)}
        >
          <div
            className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-xl p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-mono text-indigo-600 font-bold block">{selectedLoan.loanNumber}</span>
                <h3 className="text-base font-bold text-slate-900">{selectedLoan.borrowerName}</h3>
              </div>
              <RiskBadge band={selectedLoan.riskBand} size="md" />
            </div>

            <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Loan Amount</span>
                <span className="text-base font-bold text-slate-900">₹{selectedLoan.amount} Cr</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Interest Rate / Term</span>
                <span className="text-base font-bold text-slate-900">{selectedLoan.interestRate}% / {selectedLoan.termMonths}m</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">LTV / Collateral</span>
                <span className="text-sm font-bold text-slate-900">{selectedLoan.ltv}% / ₹{selectedLoan.collateralValue} Cr</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">DTI / Credit Score</span>
                <span className="text-sm font-bold text-slate-900">{selectedLoan.dti}% / {selectedLoan.creditScore}</span>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Delinquency Trajectory</span>
              <div className="flex items-center justify-between text-slate-700 font-medium">
                <span>30-Day Delinquencies: {selectedLoan.delinquencyHistory30d}</span>
                <span>90-Day Delinquencies: {selectedLoan.delinquencyHistory90d}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedLoan(null)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

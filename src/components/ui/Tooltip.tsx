import React, { useState } from 'react';
import { cn } from '../../lib/utils';

export const FINANCIAL_DEFINITIONS: Record<string, string> = {
  PD: 'Probability of Default: The calibrated likelihood (0-100%) that a borrower will fail to meet scheduled debt obligations within a 12-month horizon.',
  'Probability of Default': 'The calibrated likelihood (0-100%) that a borrower will fail to meet scheduled debt obligations within a 12-month horizon.',
  LTV: 'Loan-to-Value Ratio: Outstanding loan balance divided by appraised collateral value. Higher LTV represents thinner recovery cushion.',
  DTI: 'Debt-to-Income Ratio: Monthly debt service obligations divided by gross monthly income. Above 45% flags acute repayment vulnerability.',
  'Expected Loss': 'Statistical loss expectation calculated as: Probability of Default (PD) × Exposure at Default (EAD) × Loss Given Default (LGD).',
  'Model Confidence': 'Degree of empirical calibration certainty based on historical default backtesting and feature vector completeness.',
  'Network Exposure': 'Total downstream risk volume calculated across all direct supply chains, parent guarantees, and connected portfolio links.',
  'First-Order Exposure': 'Direct financial counterparty obligations immediately vulnerable if the primary node defaults.',
  'Second-Order Exposure': 'Indirect systemic exposure propagating through secondary suppliers and mezzanine facilities.',
  'Containment Efficiency': 'Ratio of downstream loss avoided divided by the capital cost required to execute the ring-fencing intervention.',
  'Risk DNA': '9-dimensional behavioral tensor decomposing Cash Flow, Debt Burden, Repayment Stability, Network Dependency, and Behavioral Drift.',
  'Transmission Probability': 'Conditional likelihood that financial distress in the source entity cascades across the relationship edge.',
};

export interface TooltipProps {
  content?: string;
  term?: keyof typeof FINANCIAL_DEFINITIONS;
  children: React.ReactNode;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, term, children, className }) => {
  const [isVisible, setIsVisible] = useState(false);
  const text = content || (term ? FINANCIAL_DEFINITIONS[term] : '');

  if (!text) return <>{children}</>;

  return (
    <div
      className={cn('relative inline-flex items-center', className)}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          role="tooltip"
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-64 p-2.5 bg-slate-900 border border-slate-800 text-white text-[11px] font-sans rounded-xl shadow-xl leading-relaxed text-left pointer-events-none"
        >
          {term && <span className="font-bold text-indigo-400 block mb-0.5">{term}</span>}
          <span className="text-slate-200">{text}</span>
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
        </div>
      )}
    </div>
  );
};

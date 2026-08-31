import React from 'react';
import { RiskBand } from '../../types/riskflow';

interface RiskBadgeProps {
  band: RiskBand | 'LOW' | 'WATCH' | 'HIGH' | 'CRITICAL' | string;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ band, size = 'md', showDot = true }) => {
  const normalized = (band || 'LOW').toUpperCase();

  let bgClass = 'bg-slate-100 text-slate-700 border-slate-200';
  let dotClass = 'bg-slate-500';

  if (normalized === 'CRITICAL' || normalized === 'C' || normalized === 'D') {
    bgClass = 'bg-rose-100 text-rose-700 border-rose-200 font-semibold';
    dotClass = 'bg-rose-600';
  } else if (normalized === 'HIGH' || normalized === 'B' || normalized === 'BB') {
    bgClass = 'bg-amber-100 text-amber-800 border-amber-200 font-semibold';
    dotClass = 'bg-amber-600';
  } else if (normalized === 'WATCH' || normalized === 'BBB') {
    bgClass = 'bg-indigo-100 text-indigo-700 border-indigo-200 font-medium';
    dotClass = 'bg-indigo-600';
  } else if (normalized === 'LOW' || normalized === 'A' || normalized === 'AA' || normalized === 'AAA') {
    bgClass = 'bg-emerald-100 text-emerald-800 border-emerald-200 font-semibold';
    dotClass = 'bg-emerald-600';
  }

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 font-bold',
    md: 'text-xs px-2.5 py-1 font-bold',
    lg: 'text-sm px-3.5 py-1.5 font-bold',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border uppercase tracking-wider ${bgClass} ${sizeClasses[size]}`}
    >
      {showDot && <span className={`h-1.5 w-1.5 rounded-full ${dotClass}`} />}
      {normalized}
    </span>
  );
};

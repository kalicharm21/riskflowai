import React from 'react';

interface MetricCardProps {
  id?: string;
  label: string;
  value: string | number;
  subValue?: string;
  delta?: string;
  deltaType?: 'increase' | 'decrease' | 'neutral' | 'critical';
  icon?: string;
  sparklineData?: number[];
  badge?: string;
  badgeType?: 'warning' | 'critical' | 'info' | 'success';
  tooltip?: string;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  id,
  label,
  value,
  subValue,
  delta,
  deltaType = 'neutral',
  icon,
  badge,
  badgeType = 'info',
  className = '',
}) => {
  return (
    <div
      id={id}
      className={`bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow relative group overflow-hidden ${className}`}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-xs font-bold tracking-widest text-slate-500 uppercase truncate">
          {label}
        </span>
        {icon && (
          <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-slate-500 text-lg group-hover:text-indigo-600 transition-colors">
              {icon}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between gap-2 my-2">
        <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 tracking-tight truncate">
          {value}
        </div>
        {delta && (
          <div
            className={`text-xs font-medium flex items-center gap-1 ${
              deltaType === 'increase'
                ? 'text-rose-600'
                : deltaType === 'decrease'
                ? 'text-emerald-600'
                : deltaType === 'critical'
                ? 'text-rose-600 font-semibold'
                : 'text-slate-500'
            }`}
          >
            {delta.startsWith('+') || delta.startsWith('-') ? '' : deltaType === 'increase' ? '▲ ' : '▼ '}
            {delta}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
        {subValue && <span className="text-slate-500 truncate font-sans">{subValue}</span>}
        {badge && (
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ml-auto ${
              badgeType === 'critical'
                ? 'bg-rose-100 text-rose-700'
                : badgeType === 'warning'
                ? 'bg-amber-100 text-amber-700'
                : badgeType === 'success'
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-indigo-100 text-indigo-700'
            }`}
          >
            {badge}
          </span>
        )}
      </div>
    </div>
  );
};

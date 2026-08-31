import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'critical' | 'high' | 'watch' | 'low' | 'success' | 'indigo' | 'amber';
  size?: 'sm' | 'default' | 'lg';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  size = 'default',
  children,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center font-sans font-bold tracking-tight rounded-full transition-colors whitespace-nowrap select-none';

  const variants = {
    default: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
    secondary: 'bg-slate-100 text-slate-700 border border-slate-200',
    destructive: 'bg-rose-50 text-rose-700 border border-rose-200',
    outline: 'border border-slate-200 text-slate-700 bg-white',
    critical: 'bg-rose-50 text-rose-700 border border-rose-200',
    high: 'bg-orange-50 text-orange-700 border border-orange-200',
    watch: 'bg-amber-50 text-amber-800 border border-amber-200',
    low: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    indigo: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
    amber: 'bg-amber-50 text-amber-800 border border-amber-200',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px]',
    default: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-xs',
  };

  return (
    <span className={cn(baseStyles, variants[variant], sizes[size], className)} {...props}>
      {children}
    </span>
  );
};

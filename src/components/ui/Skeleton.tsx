import React from 'react';
import { cn } from '../../lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Skeleton: React.FC<SkeletonProps> = ({ className, ...props }) => {
  return (
    <div
      className={cn('animate-pulse rounded-xl bg-slate-200/80', className)}
      {...props}
    />
  );
};

export const DashboardSkeleton: React.FC = () => (
  <div className="p-6 space-y-6 max-w-7xl mx-auto animate-pulse">
    <div className="h-20 bg-slate-200/70 rounded-2xl" />
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="h-28 bg-slate-200/70 rounded-2xl" />
      <div className="h-28 bg-slate-200/70 rounded-2xl" />
      <div className="h-28 bg-slate-200/70 rounded-2xl" />
      <div className="h-28 bg-slate-200/70 rounded-2xl" />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="h-96 lg:col-span-2 bg-slate-200/70 rounded-2xl" />
      <div className="h-96 bg-slate-200/70 rounded-2xl" />
    </div>
  </div>
);

export const TableSkeleton: React.FC = () => (
  <div className="space-y-3 p-4 bg-white rounded-2xl border border-slate-200 animate-pulse">
    <div className="h-8 bg-slate-200/70 rounded-xl w-1/3" />
    <div className="h-10 bg-slate-100 rounded-xl" />
    <div className="h-10 bg-slate-100 rounded-xl" />
    <div className="h-10 bg-slate-100 rounded-xl" />
    <div className="h-10 bg-slate-100 rounded-xl" />
  </div>
);

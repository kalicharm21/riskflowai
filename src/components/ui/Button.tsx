import React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'success' | 'subtle';
  size?: 'default' | 'sm' | 'lg' | 'icon' | 'xs';
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'default',
      size = 'default',
      isLoading = false,
      loadingText,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-sans font-semibold rounded-xl transition-all select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] cursor-pointer';

    const variants = {
      default: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs active:bg-indigo-800',
      primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs active:bg-indigo-800',
      destructive: 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 hover:border-rose-300 shadow-xs',
      outline: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:text-slate-900 shadow-xs',
      secondary: 'bg-slate-100 text-slate-800 hover:bg-slate-200 shadow-xs',
      ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900',
      success: 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 shadow-xs',
      subtle: 'bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 shadow-xs',
    };

    const sizes = {
      xs: 'h-7 px-2.5 text-[11px] gap-1',
      sm: 'h-8 px-3 text-xs gap-1.5',
      default: 'h-9 px-4 py-2 text-xs gap-2',
      lg: 'h-11 px-6 text-sm gap-2.5',
      icon: 'h-9 w-9 p-0',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <>
            <span className="material-symbols-outlined text-sm animate-spin">refresh</span>
            {loadingText || children}
          </>
        ) : (
          <>
            {leftIcon}
            {children}
            {rightIcon}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

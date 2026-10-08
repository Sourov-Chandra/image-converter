import React from 'react';

export function Card({ children, className = '', ...props }) {
  return (
    <div
      className={`bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-[0_1px_3px_rgba(0,0,0,0.05)] transition-all ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

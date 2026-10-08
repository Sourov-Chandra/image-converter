import React from 'react';

export function ProgressBar({ progress = 0, statusText = 'Processing...', className = '' }) {
  const boundedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className={`w-full space-y-1.5 ${className}`}>
      <div className="flex justify-between items-center text-xs font-semibold text-slate-600">
        <span>{statusText}</span>
        <span>{boundedProgress}%</span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/60">
        <div
          className="bg-indigo-600 h-full rounded-full transition-all duration-300 ease-out"
          style={{ width: `${boundedProgress}%` }}
        />
      </div>
    </div>
  );
}

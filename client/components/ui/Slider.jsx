'use client';

import React from 'react';

export function Slider({
  min = 1,
  max = 100,
  step = 1,
  value,
  onChange,
  disabled = false,
  label,
  valueDisplay,
  className = ''
}) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {(label || valueDisplay) && (
        <div className="flex justify-between items-center text-xs font-semibold text-slate-600 dark:text-slate-300">
          {label && <span>{label}</span>}
          {valueDisplay && (
            <span className="text-indigo-600 dark:text-indigo-300 font-bold bg-indigo-50 dark:bg-indigo-950/70 px-2 py-0.5 rounded-md border border-indigo-100 dark:border-indigo-800/60">
              {valueDisplay}
            </span>
          )}
        </div>
      )}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange?.(Number(e.target.value))}
        className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600 dark:accent-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
      />
    </div>
  );
}

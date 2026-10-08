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
        <div className="flex justify-between items-center text-xs font-semibold text-slate-600">
          {label && <span>{label}</span>}
          {valueDisplay && <span className="text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-md">{valueDisplay}</span>}
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
        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
      />
    </div>
  );
}

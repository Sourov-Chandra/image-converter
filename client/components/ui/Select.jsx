'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';

export function Select({
  options = [],
  value,
  onChange,
  disabled = false,
  className = '',
  label,
  id
}) {
  return (
    <div className={`relative inline-block ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.value)}
          aria-label={label || 'Select option'}
          className="appearance-none w-full bg-slate-50 hover:bg-slate-100/80 border border-slate-300 text-slate-800 text-sm font-semibold rounded-xl px-3.5 py-2 pr-9 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import { SUPPORTED_OUTPUT_FORMATS } from '../lib/formats.js';
import { ChevronDown } from 'lucide-react';

export function FormatSelector({
  value,
  onChange,
  disabled = false,
  className = '',
  size = 'md',
  currentInputFormat = null
}) {
  // Optional: filter out identical format if user wants, or keep available
  const options = SUPPORTED_OUTPUT_FORMATS;

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <select
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Target format"
        className={`appearance-none bg-indigo-50/80 hover:bg-indigo-100/70 border border-indigo-200/80 text-indigo-950 font-bold rounded-xl pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
          size === 'sm' ? 'text-xs px-2.5 py-1.5' : 'text-sm px-3.5 py-2'
        }`}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="text-slate-800 font-medium">
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown className="w-3.5 h-3.5 text-indigo-600 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
    </div>
  );
}

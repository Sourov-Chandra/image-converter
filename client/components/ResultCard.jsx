'use client';

import React from 'react';
import { Download, RefreshCw, CheckCircle } from 'lucide-react';
import { Button } from './ui/Button.jsx';
import { formatBytes } from '../lib/formats.js';
import { calculateSavings } from '../lib/validation.js';

export function ResultCard({ item, onConvertAnother }) {
  const result = item.result;
  if (!result) return null;

  const savings = calculateSavings(item.size, result.outputSize);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm p-6 max-w-xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
        <CheckCircle className="w-5 h-5" />
        <span>Conversion Completed Successfully!</span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-5">
        {/* Output Preview */}
        <div className="w-32 h-32 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden flex-shrink-0 flex items-center justify-center">
          <img
            src={result.url}
            alt={result.filename}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Details & Savings */}
        <div className="flex-1 space-y-2 text-center sm:text-left">
          <h4 className="text-base font-bold text-slate-900 dark:text-white break-all">
            {result.filename}
          </h4>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs">
            <span className="font-bold uppercase text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200/60 dark:border-indigo-800/60 px-2 py-0.5 rounded-md">
              {result.format}
            </span>
            {result.width && result.height && (
              <span className="text-slate-500 dark:text-slate-400 font-medium">
                {result.width} × {result.height} px
              </span>
            )}
          </div>

          <div className="pt-2 text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <div className="flex justify-between sm:justify-start sm:gap-4">
              <span className="text-slate-400 dark:text-slate-500">Original Size:</span>
              <span className="font-medium text-slate-700 dark:text-slate-300">{formatBytes(item.size)}</span>
            </div>
            <div className="flex justify-between sm:justify-start sm:gap-4">
              <span className="text-slate-400 dark:text-slate-500">Output Size:</span>
              <span className="font-bold text-slate-900 dark:text-white">{formatBytes(result.outputSize)}</span>
            </div>
            {savings && (
              <div className="pt-1">
                <span
                  className={`inline-block font-bold text-xs px-2.5 py-1 rounded-lg ${
                    savings.isSmaller
                      ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/60'
                      : 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200/60 dark:border-amber-800/60'
                  }`}
                >
                  {savings.text}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-3">
        <a
          href={result.url}
          download={result.filename}
          className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-sm transition-colors text-center"
        >
          <Download className="w-4 h-4" />
          Download {result.format.toUpperCase()}
        </a>
        <Button
          variant="outline"
          onClick={onConvertAnother}
          className="gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Convert Another
        </Button>
      </div>
    </div>
  );
}

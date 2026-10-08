'use client';

import React from 'react';
import { Download, Archive, RefreshCw, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Button } from './ui/Button.jsx';
import { formatBytes } from '../lib/formats.js';

export function BatchResultPanel({ batchResult, onConvertAnother }) {
  if (!batchResult) return null;

  const isPartial = batchResult.failedFiles > 0;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm p-6 sm:p-8 max-w-xl mx-auto space-y-6 text-center">
      <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center">
        <Archive className="w-7 h-7" />
      </div>

      <div className="space-y-1.5">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
          Batch Conversion Finished!
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Your files have been processed and compressed into a single ZIP archive.
        </p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700 text-center">
        <div>
          <span className="block text-[11px] font-semibold uppercase text-slate-400 dark:text-slate-500">Total</span>
          <span className="text-lg font-bold text-slate-800 dark:text-slate-100">{batchResult.totalFiles}</span>
        </div>
        <div>
          <span className="block text-[11px] font-semibold uppercase text-emerald-600 dark:text-emerald-400">Converted</span>
          <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1">
            <CheckCircle2 className="w-4 h-4" />
            {batchResult.successfulFiles}
          </span>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <span className="block text-[11px] font-semibold uppercase text-slate-400 dark:text-slate-500">ZIP Size</span>
          <span className="text-lg font-bold text-slate-800 dark:text-slate-100">{formatBytes(batchResult.size)}</span>
        </div>
      </div>

      {isPartial && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/60 text-amber-800 dark:text-amber-300 text-xs text-left">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 text-amber-600 dark:text-amber-400" />
          <span>
            {batchResult.failedFiles} file(s) failed conversion and could not be included.
          </span>
        </div>
      )}

      {/* Primary CTA and Reset */}
      <div className="pt-2 flex flex-col sm:flex-row gap-3">
        <a
          href={batchResult.url}
          download={batchResult.filename}
          className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-sm transition-colors"
        >
          <Download className="w-4 h-4" />
          Download All as ZIP
        </a>
        <Button
          variant="outline"
          onClick={onConvertAnother}
          className="gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Convert More Files
        </Button>
      </div>
    </div>
  );
}

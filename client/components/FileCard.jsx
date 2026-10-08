'use client';

import React from 'react';
import { X, CheckCircle2, AlertCircle, Loader2, Download, RefreshCw } from 'lucide-react';
import { formatBytes } from '../lib/formats.js';
import { calculateSavings } from '../lib/validation.js';
import { FormatSelector } from './FormatSelector.jsx';

export function FileCard({
  item,
  onTargetFormatChange,
  onRemove,
  onRetry,
  disabled = false
}) {
  const isConverting = item.status === 'converting' || item.status === 'uploading';
  const isSuccess = item.status === 'success';
  const isError = item.status === 'error';

  const savings = isSuccess && item.result
    ? calculateSavings(item.size, item.result.outputSize)
    : null;

  return (
    <div
      className={`p-3.5 sm:p-4 rounded-2xl border transition-all ${
        isSuccess
          ? 'bg-emerald-50/30 border-emerald-200'
          : isError
          ? 'bg-red-50/30 border-red-200'
          : 'bg-white border-slate-200 hover:border-slate-300'
      }`}
    >
      <div className="flex items-center gap-3.5 sm:gap-4">
        {/* Thumbnail Preview */}
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-slate-100 border border-slate-200/80 overflow-hidden flex-shrink-0 relative flex items-center justify-center">
          {item.previewUrl ? (
            <img
              src={item.previewUrl}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-[10px] font-bold text-slate-400 uppercase">
              {item.detectedFormat}
            </span>
          )}

          {isConverting && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex items-center justify-center">
              <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
            </div>
          )}
        </div>

        {/* File Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-slate-900 truncate" title={item.name}>
              {item.name}
            </h4>
            {isSuccess && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full flex-shrink-0">
                <CheckCircle2 className="w-3 h-3" />
                Done
              </span>
            )}
            {isError && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-700 bg-red-100/80 px-2 py-0.5 rounded-full flex-shrink-0">
                <AlertCircle className="w-3 h-3" />
                Error
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-slate-500">
            <span>{formatBytes(item.size)}</span>
            {item.dimensions && (
              <>
                <span className="text-slate-300">•</span>
                <span>{item.dimensions.width}×{item.dimensions.height}</span>
              </>
            )}
            <span className="text-slate-300">•</span>
            <span className="font-semibold uppercase text-slate-700">{item.detectedFormat}</span>
          </div>

          {/* Results summary or Error banner */}
          {isSuccess && item.result && (
            <div className="mt-2 text-xs flex flex-wrap items-center gap-2">
              <span className="font-semibold text-slate-700">
                Output: {formatBytes(item.result.outputSize)}
              </span>
              {savings && (
                <span
                  className={`font-semibold px-2 py-0.5 rounded-md ${
                    savings.isSmaller
                      ? 'text-emerald-700 bg-emerald-100/60'
                      : 'text-amber-700 bg-amber-100/60'
                  }`}
                >
                  {savings.text}
                </span>
              )}
            </div>
          )}

          {isError && (
            <p className="mt-1 text-xs text-red-600 font-medium">
              {item.error || 'Conversion failed'}
            </p>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {!isSuccess && !isConverting && (
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-400 hidden sm:inline">to</span>
              <FormatSelector
                value={item.targetFormat}
                onChange={(fmt) => onTargetFormatChange(item.id, fmt)}
                disabled={disabled || isConverting}
                size="sm"
              />
            </div>
          )}

          {isSuccess && item.result && (
            <a
              href={item.result.url}
              download={item.result.filename}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download</span>
            </a>
          )}

          {isError && onRetry && (
            <button
              type="button"
              onClick={() => onRetry(item.id)}
              disabled={disabled}
              className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
              title="Retry conversion"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={() => onRemove(item.id)}
            disabled={disabled || isConverting}
            className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            title="Remove file"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

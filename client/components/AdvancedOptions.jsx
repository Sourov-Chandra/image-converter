'use client';

import React, { useState } from 'react';
import { SlidersHorizontal, ChevronDown, ChevronUp, Lock, Unlock, ShieldAlert } from 'lucide-react';
import { Slider } from './ui/Slider.jsx';

export function AdvancedOptions({
  options,
  onChange,
  disabled = false,
  targetFormat = 'png'
}) {
  const [isOpen, setIsOpen] = useState(false);

  const isLossy = targetFormat === 'jpg' || targetFormat === 'webp' || targetFormat === 'avif';
  const showBackground = targetFormat === 'jpg';

  const updateField = (field, val) => {
    onChange({
      ...options,
      [field]: val
    });
  };

  return (
    <div className="w-full border border-slate-200/90 rounded-2xl bg-slate-50/60 overflow-hidden transition-all">
      {/* Toggle header */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-3.5 flex items-center justify-between text-left text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100/70 transition-colors"
      >
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
          <span>Advanced Options</span>
          <span className="text-xs font-normal text-slate-400">
            {isOpen ? '(Click to collapse)' : '(Quality, Resize, Background, Metadata)'}
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-slate-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-500" />
        )}
      </button>

      {/* Collapsed body */}
      {isOpen && (
        <div className="p-5 border-t border-slate-200/90 space-y-5 bg-white">
          {/* Quality control for lossy formats */}
          {isLossy ? (
            <div className="space-y-1.5">
              <Slider
                label={`Quality (${targetFormat.toUpperCase()})`}
                valueDisplay={`${options.quality}%`}
                min={1}
                max={100}
                value={options.quality}
                disabled={disabled}
                onChange={(val) => updateField('quality', val)}
              />
              <p className="text-xs text-slate-400">
                Recommended 80–90 for optimal quality and small file size.
              </p>
            </div>
          ) : (
            <div className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 flex items-center gap-2">
              <span className="font-semibold text-slate-700">{targetFormat.toUpperCase()}</span>
              <span>uses lossless compression algorithm. Quality slider is automatically managed.</span>
            </div>
          )}

          {/* Resize controls */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700">Resize (Optional Dimensions)</label>
              <button
                type="button"
                onClick={() => updateField('keepAspectRatio', !options.keepAspectRatio)}
                className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-lg border transition-colors ${
                  options.keepAspectRatio
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                    : 'bg-slate-100 border-slate-200 text-slate-600'
                }`}
              >
                {options.keepAspectRatio ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                {options.keepAspectRatio ? 'Lock aspect ratio' : 'Free aspect ratio'}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-500 font-medium mb-1">Width (px)</label>
                <input
                  type="number"
                  min="0"
                  placeholder="Auto"
                  disabled={disabled}
                  value={options.width || ''}
                  onChange={(e) => updateField('width', e.target.value ? parseInt(e.target.value, 10) : 0)}
                  className="w-full text-sm font-medium bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 font-medium mb-1">Height (px)</label>
                <input
                  type="number"
                  min="0"
                  placeholder="Auto"
                  disabled={disabled}
                  value={options.height || ''}
                  onChange={(e) => updateField('height', e.target.value ? parseInt(e.target.value, 10) : 0)}
                  className="w-full text-sm font-medium bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>
            </div>
            <p className="text-xs text-slate-400">Leave empty or 0 to preserve original dimensions.</p>
          </div>

          {/* Background color for JPG alpha flattening */}
          {showBackground && (
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Alpha Flattening Background
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={options.background}
                  disabled={disabled}
                  onChange={(e) => updateField('background', e.target.value)}
                  className="w-9 h-9 rounded-xl border border-slate-300 cursor-pointer p-0.5 bg-white"
                />
                <input
                  type="text"
                  value={options.background}
                  disabled={disabled}
                  onChange={(e) => updateField('background', e.target.value)}
                  placeholder="#ffffff"
                  className="text-xs font-mono uppercase bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-28"
                />
                <span className="text-xs text-slate-400">
                  Used when converting transparent PNG/WebP into JPEG.
                </span>
              </div>
            </div>
          )}

          {/* Privacy metadata toggle */}
          <div className="pt-2 border-t border-slate-100 flex items-start gap-2.5">
            <input
              id="preserveMetadata"
              type="checkbox"
              disabled={disabled}
              checked={options.preserveMetadata}
              onChange={(e) => updateField('preserveMetadata', e.target.checked)}
              className="mt-0.5 w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
            />
            <label htmlFor="preserveMetadata" className="text-xs text-slate-600 cursor-pointer select-none">
              <span className="font-semibold text-slate-800 block">Preserve image metadata (EXIF)</span>
              By default, metadata is stripped for user privacy. Check this to retain original camera tags and dates.
            </label>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon } from 'lucide-react';
import { ACCEPTED_IMAGE_TYPES } from '../lib/formats.js';

export function UploadZone({ onFilesSelected, disabled = false, compact = false }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragOver(true);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (disabled) return;

    if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(Array.from(e.target.files));
      // Reset input value so same files can be re-selected if removed
      e.target.value = '';
    }
  };

  const handleClick = () => {
    if (!disabled) inputRef.current?.click();
  };

  const handleKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
      e.preventDefault();
      inputRef.current?.click();
    }
  };

  if (compact) {
    return (
      <div>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPTED_IMAGE_TYPES}
          onChange={handleFileInput}
          className="sr-only"
          tabIndex={-1}
        />
        <button
          type="button"
          onClick={handleClick}
          disabled={disabled}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/60 rounded-xl transition-colors cursor-pointer"
        >
          <UploadCloud className="w-3.5 h-3.5" />
          Add More Images
        </button>
      </div>
    );
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative w-full rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer p-8 sm:p-12 text-center select-none outline-none focus:ring-4 focus:ring-indigo-100 ${
        isDragOver
          ? 'border-indigo-500 bg-indigo-50/70 scale-[1.01] shadow-lg shadow-indigo-100/50'
          : 'border-slate-300 hover:border-indigo-400 bg-white hover:bg-slate-50/60 shadow-[0_2px_10px_rgba(0,0,0,0.03)]'
      } ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={ACCEPTED_IMAGE_TYPES}
        onChange={handleFileInput}
        className="sr-only"
        aria-label="Upload image files"
      />

      <div className="flex flex-col items-center justify-center pointer-events-none">
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-transform ${
            isDragOver ? 'bg-indigo-600 text-white scale-110' : 'bg-indigo-50 text-indigo-600'
          }`}
        >
          {isDragOver ? (
            <UploadCloud className="w-7 h-7 animate-bounce" />
          ) : (
            <ImageIcon className="w-7 h-7" />
          )}
        </div>

        <h3 className="text-lg font-bold text-slate-800 tracking-tight">
          {isDragOver ? 'Drop images here' : 'Upload your images'}
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Drag & drop files here or{' '}
          <span className="font-semibold text-indigo-600 underline underline-offset-2">
            Choose Images
          </span>
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-1.5">
          {['JPG', 'PNG', 'JFIF', 'WEBP', 'GIF', 'AVIF'].map((fmt) => (
            <span
              key={fmt}
              className="px-2.5 py-1 text-[11px] font-bold tracking-wider rounded-lg bg-slate-100 text-slate-600 border border-slate-200/60"
            >
              {fmt}
            </span>
          ))}
        </div>

        <p className="mt-4 text-xs text-slate-400 font-medium">
          Up to 20 files per batch · Max 15 MB each · Total batch limit 100 MB
        </p>
      </div>
    </div>
  );
}

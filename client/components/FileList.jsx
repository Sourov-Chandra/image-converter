'use client';

import React from 'react';
import { FileCard } from './FileCard.jsx';
import { UploadZone } from './UploadZone.jsx';

export function FileList({
  items,
  onTargetFormatChange,
  onRemove,
  onRetry,
  onAddMoreFiles,
  disabled = false
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
          Selected Files ({items.length})
        </h3>
        {items.length < 20 && (
          <UploadZone
            onFilesSelected={onAddMoreFiles}
            disabled={disabled}
            compact={true}
          />
        )}
      </div>

      <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
        {items.map((item) => (
          <FileCard
            key={item.id}
            item={item}
            onTargetFormatChange={onTargetFormatChange}
            onRemove={onRemove}
            onRetry={onRetry}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
}

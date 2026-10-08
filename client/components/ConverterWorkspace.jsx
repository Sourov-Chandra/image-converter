'use client';

import React, { useState, useEffect } from 'react';
import { UploadZone } from './UploadZone.jsx';
import { FileList } from './FileList.jsx';
import { FormatSelector } from './FormatSelector.jsx';
import { AdvancedOptions } from './AdvancedOptions.jsx';
import { ResultCard } from './ResultCard.jsx';
import { BatchResultPanel } from './BatchResultPanel.jsx';
import { Button } from './ui/Button.jsx';
import { Card } from './ui/Card.jsx';
import { ProgressBar } from './ProgressBar.jsx';
import { detectFormatFromFilename } from '../lib/formats.js';
import { validateSelectedFiles } from '../lib/validation.js';
import { convertSingleImage, convertBatchImages } from '../lib/api.js';
import { Play, AlertCircle, Trash2 } from 'lucide-react';

export function ConverterWorkspace() {
  const [fileItems, setFileItems] = useState([]);
  const [globalTargetFormat, setGlobalTargetFormat] = useState('png');
  const [advancedOptions, setAdvancedOptions] = useState({
    quality: 85,
    width: 0,
    height: 0,
    keepAspectRatio: true,
    background: '#ffffff',
    preserveMetadata: false
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState('');
  const [globalError, setGlobalError] = useState(null);
  const [batchResult, setBatchResult] = useState(null);

  // Revoke object URLs on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      fileItems.forEach((item) => {
        if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
        if (item.result?.url) URL.revokeObjectURL(item.result.url);
      });
      if (batchResult?.url) URL.revokeObjectURL(batchResult.url);
    };
  }, [fileItems, batchResult]);

  // Read image dimensions in browser asynchronously
  const readImageDimensions = (file) => {
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        resolve({ width: img.naturalWidth, height: img.naturalHeight, url });
      };
      img.onerror = () => {
        resolve({ width: null, height: null, url });
      };
      img.src = url;
    });
  };

  // Add files to state
  const handleFilesSelected = async (newFiles) => {
    setGlobalError(null);
    setBatchResult(null);

    const { validFiles, errors } = validateSelectedFiles(newFiles, fileItems.length);

    if (errors.length > 0) {
      setGlobalError(errors.join(' '));
    }

    if (validFiles.length === 0) return;

    const newItems = await Promise.all(
      validFiles.map(async (file) => {
        const { width, height, url } = await readImageDimensions(file);
        const detected = detectFormatFromFilename(file.name);

        return {
          id: `${file.name}_${Date.now()}_${Math.random()}`,
          file,
          name: file.name,
          size: file.size,
          detectedFormat: detected,
          dimensions: width && height ? { width, height } : null,
          targetFormat: globalTargetFormat,
          status: 'ready', // ready | converting | success | error
          previewUrl: url,
          error: null,
          result: null
        };
      })
    );

    setFileItems((prev) => [...prev, ...newItems]);
  };

  // Change individual file target format
  const handleItemFormatChange = (id, newFormat) => {
    setFileItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, targetFormat: newFormat } : item
      )
    );
  };

  // Change global target format
  const handleGlobalFormatChange = (newFormat) => {
    setGlobalTargetFormat(newFormat);
    setFileItems((prev) =>
      prev.map((item) => ({ ...item, targetFormat: newFormat }))
    );
  };

  // Remove single file
  const handleRemoveFile = (id) => {
    setFileItems((prev) => {
      const item = prev.find((f) => f.id === id);
      if (item?.previewUrl) URL.revokeObjectURL(item.previewUrl);
      if (item?.result?.url) URL.revokeObjectURL(item.result.url);
      return prev.filter((f) => f.id !== id);
    });
  };

  // Clear all files
  const handleClearAll = () => {
    fileItems.forEach((item) => {
      if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
      if (item.result?.url) URL.revokeObjectURL(item.result.url);
    });
    if (batchResult?.url) URL.revokeObjectURL(batchResult.url);
    setFileItems([]);
    setBatchResult(null);
    setGlobalError(null);
  };

  // Start conversion
  const handleConvert = async () => {
    if (fileItems.length === 0 || isProcessing) return;

    setIsProcessing(true);
    setGlobalError(null);
    setProgress(15);
    setProgressText('Preparing images for conversion...');

    // SINGLE FILE FLOW
    if (fileItems.length === 1) {
      const item = fileItems[0];
      setFileItems((prev) =>
        prev.map((f) => ({ ...f, status: 'converting', error: null }))
      );

      try {
        setProgress(45);
        setProgressText(`Converting ${item.name} to ${item.targetFormat.toUpperCase()}...`);

        const conversionResult = await convertSingleImage(item.file, {
          outputFormat: item.targetFormat,
          ...advancedOptions
        });

        setProgress(100);
        setProgressText('Conversion complete!');

        setFileItems((prev) =>
          prev.map((f) => ({
            ...f,
            status: 'success',
            result: conversionResult
          }))
        );
      } catch (err) {
        setFileItems((prev) =>
          prev.map((f) => ({
            ...f,
            status: 'error',
            error: err.message
          }))
        );
        setGlobalError(err.message);
      } finally {
        setIsProcessing(false);
      }
      return;
    }

    // BATCH CONVERSION FLOW
    setFileItems((prev) =>
      prev.map((f) => ({ ...f, status: 'converting', error: null }))
    );

    try {
      setProgress(40);
      setProgressText(`Processing batch conversion of ${fileItems.length} files...`);

      const rawFiles = fileItems.map((item) => item.file);
      const zipResult = await convertBatchImages(rawFiles, {
        outputFormat: globalTargetFormat,
        ...advancedOptions
      });

      setProgress(100);
      setProgressText('Batch conversion ready for download!');
      setBatchResult(zipResult);

      setFileItems((prev) =>
        prev.map((f) => ({ ...f, status: 'success' }))
      );
    } catch (err) {
      setFileItems((prev) =>
        prev.map((f) => ({ ...f, status: 'error', error: err.message }))
      );
      setGlobalError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // Retry single item
  const handleRetryItem = async (id) => {
    const item = fileItems.find((f) => f.id === id);
    if (!item) return;

    setFileItems((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: 'converting', error: null } : f))
    );

    try {
      const res = await convertSingleImage(item.file, {
        outputFormat: item.targetFormat,
        ...advancedOptions
      });

      setFileItems((prev) =>
        prev.map((f) => (f.id === id ? { ...f, status: 'success', result: res } : f))
      );
    } catch (err) {
      setFileItems((prev) =>
        prev.map((f) => (f.id === id ? { ...f, status: 'error', error: err.message } : f))
      );
    }
  };

  const isSingleSuccess = fileItems.length === 1 && fileItems[0].status === 'success' && fileItems[0].result;

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      {/* Error alert */}
      {globalError && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200/90 dark:border-red-900/60 text-red-800 dark:text-red-300 text-sm flex items-start gap-3 shadow-sm">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold block">Conversion Alert</span>
            <span>{globalError}</span>
          </div>
          <button
            type="button"
            onClick={() => setGlobalError(null)}
            className="text-red-400 hover:text-red-600 dark:hover:text-red-300 text-xs font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Case 1: Empty state */}
      {fileItems.length === 0 && (
        <UploadZone onFilesSelected={handleFilesSelected} disabled={isProcessing} />
      )}

      {/* Case 2: Batch result finished view */}
      {batchResult && (
        <BatchResultPanel
          batchResult={batchResult}
          onConvertAnother={handleClearAll}
        />
      )}

      {/* Case 3: Single file success result view */}
      {isSingleSuccess && !batchResult && (
        <ResultCard
          item={fileItems[0]}
          onConvertAnother={handleClearAll}
        />
      )}

      {/* Case 4: File Workspace list & conversion controls */}
      {fileItems.length > 0 && !batchResult && !isSingleSuccess && (
        <div className="space-y-6">
          <Card className="p-4 sm:p-6 space-y-6">
            {/* Header toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  Convert All To:
                </span>
                <FormatSelector
                  value={globalTargetFormat}
                  onChange={handleGlobalFormatChange}
                  disabled={isProcessing}
                />
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearAll}
                  disabled={isProcessing}
                  className="text-red-600 dark:text-red-400 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear All
                </Button>
              </div>
            </div>

            {/* File cards list */}
            <FileList
              items={fileItems}
              onTargetFormatChange={handleItemFormatChange}
              onRemove={handleRemoveFile}
              onRetry={handleRetryItem}
              onAddMoreFiles={handleFilesSelected}
              disabled={isProcessing}
            />

            {/* Advanced Options */}
            <AdvancedOptions
              options={advancedOptions}
              onChange={setAdvancedOptions}
              disabled={isProcessing}
              targetFormat={globalTargetFormat}
            />

            {/* Processing progress bar */}
            {isProcessing && (
              <ProgressBar progress={progress} statusText={progressText} />
            )}

            {/* Primary Action Button */}
            <div className="pt-2">
              <Button
                variant="primary"
                size="lg"
                onClick={handleConvert}
                isLoading={isProcessing}
                disabled={fileItems.length === 0}
                className="w-full text-base py-4 shadow-lg shadow-indigo-200 dark:shadow-none"
              >
                <Play className="w-5 h-5 fill-current" />
                Convert {fileItems.length} {fileItems.length === 1 ? 'Image' : 'Images'}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

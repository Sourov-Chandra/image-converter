import { SUPPORTED_INPUT_FORMATS, getFileExtension } from './formats.js';

export const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15 MB
export const MAX_FILES_PER_BATCH = 20;
export const MAX_BATCH_SIZE_BYTES = 100 * 1024 * 1024; // 100 MB

/**
 * Validate an array of selected files for count, sizes, and extensions
 */
export function validateSelectedFiles(files, existingCount = 0) {
  const errors = [];
  const validFiles = [];

  if (existingCount + files.length > MAX_FILES_PER_BATCH) {
    errors.push(`You can only convert up to ${MAX_FILES_PER_BATCH} images at once.`);
    return { validFiles: [], errors };
  }

  let totalBatchSize = 0;

  for (const file of files) {
    const ext = getFileExtension(file.name);
    
    // Check file size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      errors.push(`"${file.name}" exceeds the 15 MB size limit.`);
      continue;
    }

    // Check unsupported obvious extension
    if (ext && !SUPPORTED_INPUT_FORMATS.includes(ext)) {
      errors.push(`"${file.name}" has an unsupported format (.${ext}).`);
      continue;
    }

    totalBatchSize += file.size;
    validFiles.push(file);
  }

  if (totalBatchSize > MAX_BATCH_SIZE_BYTES) {
    errors.push('Total batch size exceeds the 100 MB limit.');
    return { validFiles: [], errors };
  }

  return { validFiles, errors };
}

/**
 * Calculate size difference percentage per specification Section 3.9:
 * "The 'saved' percentage should be calculated only when output is smaller than input.
 * Never display a misleading negative 'saved' value; use 'Output is larger by X%' when applicable."
 */
export function calculateSavings(originalSize, outputSize) {
  if (!originalSize || !outputSize) return null;

  const diff = originalSize - outputSize;

  if (diff > 0) {
    const percent = Math.round((diff / originalSize) * 100);
    return {
      isSmaller: true,
      text: `Saved: ${formatBytes(diff)} (${percent}%)`
    };
  } else if (diff < 0) {
    const increase = outputSize - originalSize;
    const percent = Math.round((increase / originalSize) * 100);
    return {
      isSmaller: false,
      text: `Output is larger by ${percent}%`
    };
  }

  return {
    isSmaller: true,
    text: 'Size unchanged (0%)'
  };
}

function formatBytes(bytes) {
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

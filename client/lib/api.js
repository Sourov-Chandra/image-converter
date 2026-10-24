const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api/v1';

/**
 * Diagnostic helper for network failures (local dev vs deployed production)
 */
function getNetworkErrorMessage() {
  if (
    typeof window !== 'undefined' &&
    window.location.protocol === 'https:' &&
    API_BASE_URL.startsWith('http://localhost')
  ) {
    return 'Configuration Error: The live website is trying to connect to localhost. Please configure NEXT_PUBLIC_API_BASE_URL in your Vercel Project Environment Variables with your deployed backend URL.';
  }
  return 'Network error. Unable to reach the conversion server. If your backend is hosted on a free platform (e.g. Render), please wait a moment for it to wake up from sleep and try again.';
}

/**
 * Parse structured error response from server
 */
async function parseError(response) {
  try {
    const data = await response.json();
    if (data?.error?.message) {
      return data.error.message;
    }
  } catch {
    // Not JSON
  }

  if (response.status === 413) {
    return 'The uploaded file exceeds the allowed size limit.';
  }
  if (response.status === 429) {
    return 'Too many requests. Please try again shortly.';
  }
  if (response.status >= 500) {
    return 'Conversion service error. Please try again with another image.';
  }

  return `Request failed with status ${response.status}.`;
}

/**
 * Convert a single image
 */
export async function convertSingleImage(file, options = {}) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('outputFormat', options.outputFormat || 'png');

  if (options.quality !== undefined) formData.append('quality', String(options.quality));
  if (options.width) formData.append('width', String(options.width));
  if (options.height) formData.append('height', String(options.height));
  if (options.keepAspectRatio !== undefined) formData.append('keepAspectRatio', String(options.keepAspectRatio));
  if (options.background) formData.append('background', options.background);
  if (options.preserveMetadata !== undefined) formData.append('preserveMetadata', String(options.preserveMetadata));

  let response;
  try {
    response = await fetch(`${API_BASE_URL}/convert`, {
      method: 'POST',
      body: formData
    });
  } catch (err) {
    throw new Error(getNetworkErrorMessage());
  }

  if (!response.ok) {
    const errorMsg = await parseError(response);
    throw new Error(errorMsg);
  }

  const blob = await response.blob();

  // Extract metadata headers
  const originalSize = parseInt(response.headers.get('x-original-size'), 10) || file.size;
  const outputSize = parseInt(response.headers.get('x-output-size'), 10) || blob.size;
  const outputWidth = parseInt(response.headers.get('x-output-width'), 10) || null;
  const outputHeight = parseInt(response.headers.get('x-output-height'), 10) || null;
  const outputFormat = response.headers.get('x-output-format') || options.outputFormat;

  // Extract filename from Content-Disposition if present
  let filename = `converted.${outputFormat}`;
  const disposition = response.headers.get('content-disposition');
  if (disposition && disposition.includes('filename=')) {
    const match = disposition.match(/filename="?([^";]+)"?/);
    if (match && match[1]) {
      filename = match[1];
    }
  }

  return {
    blob,
    url: URL.createObjectURL(blob),
    filename,
    originalSize,
    outputSize,
    width: outputWidth,
    height: outputHeight,
    format: outputFormat
  };
}

/**
 * Convert multiple images in batch
 */
export async function convertBatchImages(files, options = {}) {
  const formData = new FormData();
  for (const file of files) {
    formData.append('files', file);
  }
  formData.append('outputFormat', options.outputFormat || 'webp');

  if (options.quality !== undefined) formData.append('quality', String(options.quality));
  if (options.width) formData.append('width', String(options.width));
  if (options.height) formData.append('height', String(options.height));
  if (options.keepAspectRatio !== undefined) formData.append('keepAspectRatio', String(options.keepAspectRatio));
  if (options.background) formData.append('background', options.background);
  if (options.preserveMetadata !== undefined) formData.append('preserveMetadata', String(options.preserveMetadata));

  let response;
  try {
    response = await fetch(`${API_BASE_URL}/convert/batch`, {
      method: 'POST',
      body: formData
    });
  } catch (err) {
    throw new Error(getNetworkErrorMessage());
  }

  if (!response.ok) {
    const errorMsg = await parseError(response);
    throw new Error(errorMsg);
  }

  const blob = await response.blob();
  const totalFiles = parseInt(response.headers.get('x-total-files'), 10) || files.length;
  const successfulFiles = parseInt(response.headers.get('x-successful-files'), 10) || files.length;
  const failedFiles = parseInt(response.headers.get('x-failed-files'), 10) || 0;

  return {
    blob,
    url: URL.createObjectURL(blob),
    filename: 'converted-images.zip',
    totalFiles,
    successfulFiles,
    failedFiles,
    size: blob.size
  };
}

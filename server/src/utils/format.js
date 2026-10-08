// Centralized format definitions per specification Section 4 & 8.1

export const SUPPORTED_INPUT_FORMATS = ['jpeg', 'jpg', 'jfif', 'png', 'webp', 'gif', 'avif', 'heif'];
export const SUPPORTED_OUTPUT_FORMATS = ['jpeg', 'jpg', 'png', 'webp', 'avif', 'gif'];

export const MIME_TYPE_MAP = {
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',
  jfif: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  avif: 'image/avif',
  gif: 'image/gif'
};

export const EXTENSION_MAP = {
  jpeg: 'jpg',
  jpg: 'jpg',
  jfif: 'jpg',
  png: 'png',
  webp: 'webp',
  avif: 'avif',
  gif: 'gif'
};

/**
 * Normalizes format string (e.g. 'JPEG' -> 'jpeg', 'jfif' -> 'jpeg', 'heif' -> 'avif' for sharp)
 */
export function normalizeFormat(format) {
  if (!format || typeof format !== 'string') return '';
  const lower = format.trim().toLowerCase().replace(/^\./, '');
  if (lower === 'jpg' || lower === 'jfif') return 'jpeg';
  if (lower === 'heif') return 'avif';
  return lower;
}

/**
 * Normalizes output format to the target extension
 */
export function normalizeOutputExtension(format) {
  const norm = normalizeFormat(format);
  return EXTENSION_MAP[norm] || norm;
}

/**
 * Checks if input format is supported
 */
export function isInputFormatSupported(format) {
  if (!format) return false;
  const lower = format.trim().toLowerCase().replace(/^\./, '');
  return SUPPORTED_INPUT_FORMATS.includes(lower);
}

/**
 * Checks if output format is supported
 */
export function isOutputFormatSupported(format) {
  if (!format) return false;
  const lower = format.trim().toLowerCase().replace(/^\./, '');
  return SUPPORTED_OUTPUT_FORMATS.includes(lower);
}

/**
 * Get Content-Type MIME for output format
 */
export function getMimeType(format) {
  const norm = normalizeFormat(format);
  return MIME_TYPE_MAP[norm] || 'application/octet-stream';
}

/**
 * Formats that support alpha channel (transparency)
 */
export const ALPHA_SUPPORTING_FORMATS = ['png', 'webp', 'avif', 'gif'];

export function supportsAlpha(format) {
  const norm = normalizeFormat(format);
  return ALPHA_SUPPORTING_FORMATS.includes(norm);
}

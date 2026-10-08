import path from 'path';
import { normalizeOutputExtension } from './format.js';

/**
 * Sanitizes a basename to prevent path traversal or unsafe header characters
 */
export function sanitizeBasename(rawName) {
  if (!rawName || typeof rawName !== 'string') {
    return 'image';
  }

  // Extract base filename without directories
  const parsed = path.parse(rawName);
  let base = parsed.name || 'image';

  // Remove directory traversal characters, null bytes, quotes, and control chars
  base = base
    .replace(/[\x00-\x1f\x7f\\/:"*?<>|]/g, '_')
    .replace(/\.+/g, '.')
    .trim();

  // If base ended up empty or just dots
  if (!base || base === '.') {
    base = 'image';
  }

  // Limit max length to 100 characters for safety
  return base.slice(0, 100);
}

/**
 * Builds safe output filename by replacing the extension with normalized output extension
 */
export function buildOutputFilename(originalName, targetFormat) {
  const base = sanitizeBasename(originalName);
  const ext = normalizeOutputExtension(targetFormat);
  return `${base}.${ext}`;
}

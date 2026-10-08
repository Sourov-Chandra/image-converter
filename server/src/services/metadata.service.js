import sharp from 'sharp';
import { config } from '../config/env.js';
import { AppError } from '../middleware/errorHandler.js';
import { isInputFormatSupported, normalizeFormat } from '../utils/format.js';

/**
 * Inspect image metadata, check dimensions, detect animations, and validate format
 * @param {Buffer|string} inputBufferOrPath
 * @returns {Promise<sharp.Metadata>}
 */
export async function inspectImageMetadata(inputBufferOrPath) {
  let metadata;
  try {
    metadata = await sharp(inputBufferOrPath).metadata();
  } catch (err) {
    throw new AppError(
      'File cannot be decoded as a supported image.',
      400,
      'INVALID_IMAGE',
      { details: err.message }
    );
  }

  const detectedFormat = normalizeFormat(metadata.format);

  // Check if format is supported in MVP
  if (!detectedFormat || !isInputFormatSupported(detectedFormat)) {
    throw new AppError(
      `Image format '${metadata.format || 'unknown'}' is not supported.`,
      415,
      'UNSUPPORTED_IMAGE_FORMAT',
      { detectedFormat: metadata.format }
    );
  }

  // Check for animated images (GIF or animated WebP)
  if (metadata.pages && metadata.pages > 1) {
    throw new AppError(
      'Animated images are not supported yet. Please upload a static image.',
      400,
      'ANIMATED_IMAGE_UNSUPPORTED',
      { pages: metadata.pages }
    );
  }

  // Check pixel safety limits
  const totalPixels = (metadata.width || 0) * (metadata.height || 0);
  if (totalPixels > config.maxImagePixels) {
    throw new AppError(
      `Image dimensions (${metadata.width}x${metadata.height}) exceed the maximum safety limit.`,
      400,
      'INVALID_IMAGE',
      {
        width: metadata.width,
        height: metadata.height,
        maxPixels: config.maxImagePixels
      }
    );
  }

  return {
    ...metadata,
    detectedFormat
  };
}

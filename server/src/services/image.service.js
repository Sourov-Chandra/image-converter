import sharp from 'sharp';
import { inspectImageMetadata } from './metadata.service.js';
import {
  normalizeFormat,
  normalizeOutputExtension,
  supportsAlpha,
  isOutputFormatSupported
} from '../utils/format.js';
import { AppError } from '../middleware/errorHandler.js';

/**
 * Converts an image buffer or file according to target options
 *
 * @param {Buffer|string} inputBufferOrPath
 * @param {Object} options
 * @param {string} options.outputFormat - target format (jpeg, png, webp, avif, gif)
 * @param {number} [options.quality=85] - quality for lossy formats (1-100)
 * @param {number} [options.width] - target width in pixels
 * @param {number} [options.height] - target height in pixels
 * @param {boolean} [options.keepAspectRatio=true] - preserve aspect ratio when resizing
 * @param {string} [options.background='#ffffff'] - background color for alpha flattening
 * @param {boolean} [options.preserveMetadata=false] - whether to retain EXIF/metadata
 * @returns {Promise<{ buffer: Buffer, info: Object }>}
 */
export async function convertImage(inputBufferOrPath, options = {}) {
  const {
    outputFormat,
    quality = 85,
    width,
    height,
    keepAspectRatio = true,
    background = '#ffffff',
    preserveMetadata = false
  } = options;

  const targetFormat = normalizeFormat(outputFormat);

  if (!targetFormat || !isOutputFormatSupported(targetFormat)) {
    throw new AppError(
      `Target format '${outputFormat}' is not supported.`,
      400,
      'INVALID_OUTPUT_FORMAT',
      { outputFormat }
    );
  }

  // 1. Inspect metadata & validate format, dimensions, animation
  const metadata = await inspectImageMetadata(inputBufferOrPath);

  // 2. Initialize Sharp pipeline
  let pipeline = sharp(inputBufferOrPath);

  // 3. Auto-orient image according to EXIF orientation so previews/results don't rotate
  pipeline = pipeline.rotate();

  // 4. Resize if width or height specified
  const parsedWidth = width ? parseInt(width, 10) : undefined;
  const parsedHeight = height ? parseInt(height, 10) : undefined;

  if ((parsedWidth && parsedWidth > 0) || (parsedHeight && parsedHeight > 0)) {
    pipeline = pipeline.resize({
      width: parsedWidth > 0 ? parsedWidth : undefined,
      height: parsedHeight > 0 ? parsedHeight : undefined,
      fit: keepAspectRatio ? 'inside' : 'fill',
      withoutEnlargement: false
    });
  }

  // 5. Transparency / Alpha handling
  const sourceHasAlpha = metadata.hasAlpha || metadata.channels === 4;
  const targetSupportsAlpha = supportsAlpha(targetFormat);

  // If target does not support alpha (e.g. JPEG), flatten alpha onto background
  if (!targetSupportsAlpha && sourceHasAlpha) {
    pipeline = pipeline.flatten({ background: background || '#ffffff' });
  }

  // 6. Target-specific format encoding
  const parsedQuality = Math.max(1, Math.min(100, parseInt(quality, 10) || 85));

  switch (targetFormat) {
    case 'jpeg':
      pipeline = pipeline.jpeg({
        quality: parsedQuality,
        mozjpeg: true
      });
      break;

    case 'png':
      // Lossless PNG encoding
      pipeline = pipeline.png({
        compressionLevel: 9,
        adaptiveFiltering: true
      });
      break;

    case 'webp':
      pipeline = pipeline.webp({
        quality: parsedQuality,
        lossless: false
      });
      break;

    case 'avif':
      pipeline = pipeline.avif({
        quality: parsedQuality,
        effort: 4
      });
      break;

    case 'gif':
      // Static GIF
      pipeline = pipeline.gif({
        reoptimise: true
      });
      break;

    default:
      throw new AppError(
        `Unsupported target format: ${targetFormat}`,
        400,
        'INVALID_OUTPUT_FORMAT'
      );
  }

  // 7. Metadata handling (privacy-first: strip metadata unless explicitly requested)
  if (preserveMetadata) {
    pipeline = pipeline.withMetadata();
  }

  // 8. Execute conversion to buffer
  let outputBuffer;
  let info;
  try {
    const result = await pipeline.toBuffer({ resolveWithObject: true });
    outputBuffer = result.data;
    info = result.info;
  } catch (err) {
    throw new AppError(
      `Image conversion failed: ${err.message}`,
      500,
      'CONVERSION_FAILED',
      { details: err.message }
    );
  }

  return {
    buffer: outputBuffer,
    info: {
      format: normalizeOutputExtension(targetFormat),
      width: info.width,
      height: info.height,
      size: info.size || outputBuffer.length,
      originalFormat: metadata.detectedFormat,
      originalWidth: metadata.width,
      originalHeight: metadata.height,
      originalSize: metadata.size || (Buffer.isBuffer(inputBufferOrPath) ? inputBufferOrPath.length : null)
    }
  };
}

import { isOutputFormatSupported } from '../utils/format.js';
import { AppError } from './errorHandler.js';

const HEX_COLOR_REGEX = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

/**
 * Validate conversion options in request body
 */
export function validateConversionOptions(req, res, next) {
  const { outputFormat, quality, width, height, background, keepAspectRatio, preserveMetadata } = req.body;

  // 1. Output format is mandatory
  if (!outputFormat) {
    return next(new AppError('Target output format is required.', 400, 'INVALID_OUTPUT_FORMAT'));
  }

  if (!isOutputFormatSupported(outputFormat)) {
    return next(new AppError(
      `Requested target format '${outputFormat}' is not allowed.`,
      400,
      'INVALID_OUTPUT_FORMAT',
      { outputFormat }
    ));
  }

  // 2. Validate quality if specified
  if (quality !== undefined && quality !== '') {
    const q = Number(quality);
    if (isNaN(q) || !Number.isInteger(q) || q < 1 || q > 100) {
      return next(new AppError(
        'Quality must be an integer between 1 and 100.',
        400,
        'INVALID_OPTION',
        { quality }
      ));
    }
  }

  // 3. Validate width if specified
  if (width !== undefined && width !== '') {
    const w = Number(width);
    if (isNaN(w) || !Number.isInteger(w) || w < 0) {
      return next(new AppError(
        'Width must be a positive integer or 0.',
        400,
        'INVALID_OPTION',
        { width }
      ));
    }
  }

  // 4. Validate height if specified
  if (height !== undefined && height !== '') {
    const h = Number(height);
    if (isNaN(h) || !Number.isInteger(h) || h < 0) {
      return next(new AppError(
        'Height must be a positive integer or 0.',
        400,
        'INVALID_OPTION',
        { height }
      ));
    }
  }

  // 5. Validate background color if specified
  if (background !== undefined && background !== '') {
    if (!HEX_COLOR_REGEX.test(background)) {
      return next(new AppError(
        'Background color must be a valid hex color code (e.g. #ffffff).',
        400,
        'INVALID_OPTION',
        { background }
      ));
    }
  }

  // Normalize parsed values onto req.conversionOptions
  req.conversionOptions = {
    outputFormat: outputFormat.trim().toLowerCase(),
    quality: quality ? parseInt(quality, 10) : 85,
    width: width ? parseInt(width, 10) : 0,
    height: height ? parseInt(height, 10) : 0,
    keepAspectRatio: keepAspectRatio === undefined ? true : (keepAspectRatio === 'true' || keepAspectRatio === true),
    background: background || '#ffffff',
    preserveMetadata: preserveMetadata === 'true' || preserveMetadata === true
  };

  next();
}

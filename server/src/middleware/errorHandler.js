import multer from 'multer';
import { config } from '../config/env.js';

export class AppError extends Error {
  constructor(message, statusCode = 400, code = 'INVALID_OPTION', details = {}) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

/**
 * Standardized error handling middleware per specification Section 7.5 & 7.6
 */
export function errorHandler(err, req, res, next) {
  // If response headers already sent
  if (res.headersSent) {
    return next(err);
  }

  let statusCode = err.statusCode || 500;
  let code = err.code || 'CONVERSION_FAILED';
  let message = err.message || 'An unexpected error occurred during conversion.';
  let details = err.details || {};

  // Handle Multer upload errors
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      statusCode = 413;
      code = 'FILE_TOO_LARGE';
      message = `This file exceeds the ${(config.maxFileSizeBytes / (1024 * 1024)).toFixed(0)} MB upload limit.`;
      details = { maxBytes: config.maxFileSizeBytes };
    } else if (err.code === 'LIMIT_FILE_COUNT') {
      statusCode = 413;
      code = 'TOO_MANY_FILES';
      message = `Batch file count exceeds maximum allowed (${config.maxFilesPerBatch} files).`;
      details = { maxFiles: config.maxFilesPerBatch };
    } else {
      statusCode = 400;
      code = 'INVALID_OPTION';
      message = err.message;
    }
  }

  // Handle Sharp image decoding errors
  if (!err.statusCode && (err.message?.includes('Input file is missing') || err.message?.includes('unsupported image format') || err.message?.includes('VipsForeignLoad'))) {
    statusCode = 400;
    code = 'INVALID_IMAGE';
    message = 'File cannot be decoded as a supported image.';
  }

  // Hide internal stack traces in production
  const responsePayload = {
    success: false,
    error: {
      code,
      message,
      ...(Object.keys(details).length > 0 ? { details } : {})
    }
  };

  if (config.nodeEnv !== 'production' && statusCode === 500) {
    responsePayload.error.stack = err.stack;
  }

  res.status(statusCode).json(responsePayload);
}

import multer from 'multer';
import { config } from '../config/env.js';
import { AppError } from './errorHandler.js';

// Controlled in-memory buffer handling per specification Section 6.4
const storage = multer.memoryStorage();

// Configure Multer with limits (giving slight headroom to handle graceful 413 error responses)
const multerInstance = multer({
  storage,
  limits: {
    fileSize: config.maxFileSizeBytes,
    files: config.maxFilesPerBatch + 10,
    fields: 15,
    parts: 50
  }
});

/**
 * Middleware for single file upload
 */
export const uploadSingle = (req, res, next) => {
  const upload = multerInstance.single('file');

  upload(req, res, (err) => {
    if (err) {
      return next(err);
    }

    if (!req.file) {
      return next(new AppError('No file supplied.', 400, 'MISSING_FILE'));
    }

    next();
  });
};

/**
 * Middleware for batch files upload
 */
export const uploadBatch = (req, res, next) => {
  // Support both 'files' and 'files[]' field names with headroom for graceful 413 responses
  const upload = multerInstance.fields([
    { name: 'files', maxCount: config.maxFilesPerBatch + 10 },
    { name: 'files[]', maxCount: config.maxFilesPerBatch + 10 }
  ]);

  upload(req, res, (err) => {
    if (err) {
      return next(err);
    }

    const files = [
      ...(req.files?.files || []),
      ...(req.files?.['files[]'] || [])
    ];

    if (!files || files.length === 0) {
      return next(new AppError('No files supplied.', 400, 'MISSING_FILE'));
    }

    if (files.length > config.maxFilesPerBatch) {
      return next(new AppError(
        `Batch file count exceeds limit of ${config.maxFilesPerBatch} files.`,
        413,
        'TOO_MANY_FILES',
        { maxFiles: config.maxFilesPerBatch, received: files.length }
      ));
    }

    // Check aggregate batch size
    const totalSize = files.reduce((acc, f) => acc + f.size, 0);
    if (totalSize > config.maxBatchSizeBytes) {
      return next(new AppError(
        `Total batch size exceeds ${(config.maxBatchSizeBytes / (1024 * 1024)).toFixed(0)} MB limit.`,
        413,
        'BATCH_TOO_LARGE',
        { maxBytes: config.maxBatchSizeBytes, totalBytes: totalSize }
      ));
    }

    req.batchFiles = files;
    next();
  });
};

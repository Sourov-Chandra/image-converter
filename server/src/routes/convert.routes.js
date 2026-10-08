import { Router } from 'express';
import { uploadSingle, uploadBatch } from '../middleware/upload.js';
import { validateConversionOptions } from '../middleware/validate.js';
import { convertSingle, convertBatch } from '../controllers/convert.controller.js';
import { conversionRateLimiter } from '../middleware/rateLimit.js';

const router = Router();

// Single conversion route per specification Section 7.3
router.post(
  '/convert',
  conversionRateLimiter,
  uploadSingle,
  validateConversionOptions,
  convertSingle
);

// Batch conversion route per specification Section 7.4
router.post(
  '/convert/batch',
  conversionRateLimiter,
  uploadBatch,
  validateConversionOptions,
  convertBatch
);

export default router;

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const config = {
  port: parseInt(process.env.PORT, 10) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendOrigin: process.env.FRONTEND_ORIGIN || 'http://localhost:3000',

  // Upload Limits (from spec section 6.3)
  maxFileSizeBytes: parseInt(process.env.MAX_FILE_SIZE_BYTES, 10) || 15 * 1024 * 1024, // 15 MB
  maxFilesPerBatch: parseInt(process.env.MAX_FILES_PER_BATCH, 10) || 20,
  maxBatchSizeBytes: parseInt(process.env.MAX_BATCH_SIZE_BYTES, 10) || 100 * 1024 * 1024, // 100 MB
  maxImagePixels: parseInt(process.env.MAX_IMAGE_PIXELS, 10) || 100 * 1000 * 1000, // 100 MP

  // Rate Limiting (from spec section 8.2)
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000, // 15 mins
  rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 30,

  // Temporary directory for processing
  tempDir: path.resolve(__dirname, '../../temp')
};

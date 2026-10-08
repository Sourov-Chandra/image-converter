import rateLimit from 'express-rate-limit';
import { config } from '../config/env.js';

/**
 * Conversion endpoint rate limiter per specification Section 6.3 & 7.6
 */
export const conversionRateLimiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMaxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: {
        code: 'RATE_LIMITED',
        message: 'Too many conversion requests. Please try again shortly.'
      }
    });
  }
});

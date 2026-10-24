import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/env.js';
import healthRoutes from './routes/health.routes.js';
import convertRoutes from './routes/convert.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// Cross-Origin Resource Sharing with exposed custom headers
const allowedOrigins = config.frontendOrigin
  ? config.frontendOrigin.split(',').map((o) => o.trim())
  : ['http://localhost:3000', 'https://picnito.vercel.app'];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow server-to-server requests or tools like Postman/curl (no origin header)
    if (!origin) return callback(null, true);

    if (
      config.nodeEnv !== 'production' ||
      config.frontendOrigin === '*' ||
      allowedOrigins.includes(origin) ||
      allowedOrigins.includes('*') ||
      origin.endsWith('.vercel.app')
    ) {
      return callback(null, true);
    }

    return callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true,
  exposedHeaders: [
    'Content-Disposition',
    'X-Original-Size',
    'X-Output-Size',
    'X-Output-Width',
    'X-Output-Height',
    'X-Output-Format',
    'X-Total-Files',
    'X-Successful-Files',
    'X-Failed-Files'
  ]
};

app.use(cors(corsOptions));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint per specification Section 7.2
app.use('/api', healthRoutes);

// Conversion endpoints per specification Section 7.1
app.use('/api/v1', convertRoutes);

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Endpoint ${req.method} ${req.originalUrl} not found.`
    }
  });
});

// Centralized error handler
app.use(errorHandler);

export default app;

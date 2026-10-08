import app from './app.js';
import { config } from './config/env.js';
import { ensureDir } from './utils/cleanup.js';

await ensureDir(config.tempDir);

const server = app.listen(config.port, () => {
  console.log(`[image-converter-server] Running on http://localhost:${config.port}`);
  console.log(`[image-converter-server] Environment: ${config.nodeEnv}`);
});

// Graceful shutdown handling
function gracefulShutdown(signal) {
  console.log(`[image-converter-server] Received ${signal}, shutting down gracefully...`);
  server.close(() => {
    console.log('[image-converter-server] Closed out remaining connections.');
    process.exit(0);
  });

  setTimeout(() => {
    console.error('[image-converter-server] Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

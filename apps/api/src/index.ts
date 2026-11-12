import { createApp } from './app.js';
import { env } from './config/env.js';

const app = createApp();

const server = app.listen(env.port, () => {
  console.log(`===============================================`);
  console.log(`🚀 IPOTrack API Server running`);
  console.log(`📡 URL: http://localhost:${env.port}`);
  console.log(`🩺 Health: http://localhost:${env.port}/health`);
  console.log(`🌐 Allowed Client: ${env.clientUrl}`);
  console.log(`⚡ Environment: ${env.nodeEnv}`);
  console.log(`===============================================`);
});

// Graceful shutdown handling
const shutdown = (signal: string) => {
  console.log(`\nReceived ${signal}. Shutting down gracefully...`);
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });

  // Force shutdown after 10 seconds if hanging
  setTimeout(() => {
    console.error('Forced shutdown due to timeout.');
    process.exit(1);
  }, 10000).unref();
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

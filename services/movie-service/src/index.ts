import { config } from './config';
import { createApp } from './app';
import { connectToDatabase } from './config/database';

/**
 * Start the server
 */
async function startServer() {
  try {
    // Connect to MongoDB
    await connectToDatabase();

    // Create and start Express app
    const app = createApp();
    app.listen(config.server.port, () => {
      console.info(
        `Movie service is running on port ${config.server.port} in ${config.server.nodeEnv} mode`
      );
      console.info(`API documentation available at ${config.api.prefix}/docs`);
    });

    // Handle shutdown
    const shutdown = async () => {
      console.info('Shutting down server...');
      process.exit(0);
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer(); 
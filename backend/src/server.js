const app = require('./app');
const config = require('./config/env');
const connectDB = require('./config/db');

// Handle Uncaught Exceptions
process.on('uncaughtException', (err) => {
  console.error('💥 UNCAUGHT EXCEPTION! Shutting down process...');
  console.error(err.name, err.message, err.stack);
  process.exit(1);
});

let server;

const startServer = async () => {
  try {
    // 1. Connect to MongoDB
    await connectDB();

    // 2. Start HTTP Server
    server = app.listen(config.port, () => {
      console.log(`📡 Server running in [${config.nodeEnv}] mode on port ${config.port}`);
      console.log(`🔗 API Base URL: http://localhost:${config.port}/api/v1`);
    });
  } catch (error) {
    console.error(`💥 Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();

// Handle Unhandled Rejections
process.on('unhandledRejection', (err) => {
  console.error('💥 UNHANDLED REJECTION! Shutting down server gracefully...');
  console.error(err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

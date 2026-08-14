const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const errorHandler = require('./middleware/errorMiddleware');
const ApiError = require('./utils/ApiError');
const config = require('./config/env');

const app = express();

// Configure CORS
app.use(
  cors({
    origin: [config.clientUrl, 'http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body Parsing Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Base Root Route
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Content Feed Backend API Service is Active',
    version: 'v1',
    endpoints: {
      health: '/api/v1/health',
      feed: '/api/v1/feed',
      bookmarks: '/api/v1/bookmarks',
      auth: '/api/v1/auth',
    },
  });
});

// Mount Main API Routes with /api/v1 prefix
app.use('/api/v1', routes);

// Catch-all 404 handler for undefined routes
app.use((req, res, next) => {
  next(new ApiError(404, `Cannot find route '${req.originalUrl}' on this server.`));
});

// Global Central Error Handler Middleware
app.use(errorHandler);

module.exports = app;

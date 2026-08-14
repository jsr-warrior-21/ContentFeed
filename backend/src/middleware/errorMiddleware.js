const ApiError = require('../utils/ApiError');
const config = require('../config/env');

/**
 * Global Centralized Express Error Handling Middleware
 */
const errorHandler = (err, req, res, next) => {
  let error = err;

  // If error is not an instance of ApiError, convert it
  if (!(error instanceof ApiError)) {
    let statusCode = error.statusCode || 500;
    let message = error.message || 'Internal Server Error';

    // Mongoose CastError (e.g. invalid ObjectId format)
    if (err.name === 'CastError') {
      statusCode = 400;
      message = `Invalid resource ID format: ${err.value}`;
    }

    // Mongoose Duplicate Key Error (MongoDB E11000)
    if (err.code === 11000) {
      statusCode = 409;
      const field = Object.keys(err.keyValue || {})[0] || 'field';
      message = `Duplicate resource error: ${field} already exists.`;
    }

    // Mongoose Validation Error
    if (err.name === 'ValidationError') {
      statusCode = 400;
      const errors = Object.values(err.errors).map((el) => el.message);
      message = `Validation Error: ${errors.join(', ')}`;
    }

    // JWT JsonWebTokenError
    if (err.name === 'JsonWebTokenError') {
      statusCode = 401;
      message = 'Invalid authentication token signature.';
    }

    // JWT TokenExpiredError
    if (err.name === 'TokenExpiredError') {
      statusCode = 401;
      message = 'Authentication token has expired. Please log in again.';
    }

    error = new ApiError(statusCode, message, error.errors || [], err.stack);
  }

  const response = {
    success: false,
    statusCode: error.statusCode,
    message: error.message,
    ...(error.errors && error.errors.length > 0 && { errors: error.errors }),
    ...(config.nodeEnv === 'development' && { stack: error.stack }),
  };

  res.status(error.statusCode).json(response);
};

module.exports = errorHandler;

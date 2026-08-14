const { verifyToken } = require('../utils/jwt');
const ApiError = require('../utils/ApiError');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Protect route middleware - ensures valid JWT token is provided in headers
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new ApiError(401, 'Authentication failed. Access token is missing.');
  }

  try {
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id);

    if (!user) {
      throw new ApiError(401, 'The user associated with this token no longer exists.');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(401, 'Invalid or expired authentication token.');
  }
});

module.exports = { protect };

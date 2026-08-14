const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

/**
 * Middleware to check express-validator validation results
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((err) => err.msg);
    throw new ApiError(400, errorMessages[0] || 'Invalid request payload format.', errorMessages);
  }
  next();
};

module.exports = validate;

const jwt = require('jsonwebtoken');
const config = require('../config/env');

/**
 * Generate JWT Token for authenticated user
 * @param {string} userId - Mongoose User ObjectId string
 * @returns {string} Signed JWT Token
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
};

/**
 * Verify JWT Token
 * @param {string} token 
 * @returns {object} Decoded token payload
 */
const verifyToken = (token) => {
  return jwt.verify(token, config.jwtSecret);
};

module.exports = {
  generateToken,
  verifyToken,
};

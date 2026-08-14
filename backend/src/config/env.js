const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '../../.env') });

const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/content_feed_db',
  jwtSecret: process.env.JWT_SECRET || 'fallback_secret_key_antigravity_2026',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
};

// Validate critical configuration variables
if (!process.env.MONGODB_URI) {
  console.warn('⚠️ Warning: MONGODB_URI is not explicitly defined in .env! Using default local URI.');
}

if (!process.env.JWT_SECRET) {
  console.warn('⚠️ Warning: JWT_SECRET is not explicitly defined in .env! Using default secret.');
}

module.exports = config;

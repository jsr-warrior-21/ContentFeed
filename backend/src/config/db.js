const mongoose = require('mongoose');
const config = require('./env');

/**
 * Connect to MongoDB instance using Mongoose
 * Includes try-catch and proper process exit handling
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongodbUri);
    console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host} / ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Failure: ${error.message}`);
    // Rethrow or exit process depending on environment
    throw error;
  }
};

module.exports = connectDB;

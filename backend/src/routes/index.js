const express = require('express');
const authRoutes = require('./authRoutes');
const feedRoutes = require('./feedRoutes');
const bookmarkRoutes = require('./bookmarkRoutes');

const router = express.Router();

// Mount sub-routers
router.use('/auth', authRoutes);
router.use('/feed', feedRoutes);
router.use('/bookmarks', bookmarkRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Content Feed API Service',
  });
});

module.exports = router;

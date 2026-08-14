const express = require('express');
const { getBookmarks } = require('../controllers/bookmarkController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Protected route to list authenticated user's bookmarks
router.get('/', protect, getBookmarks);

module.exports = router;

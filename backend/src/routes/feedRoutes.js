const express = require('express');
const { getFeed, getContentById } = require('../controllers/feedController');
const { addBookmark, removeBookmark } = require('../controllers/bookmarkController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Public Feed Routes
router.get('/', getFeed);
router.get('/:id', getContentById);

// Protected Bookmark Actions on Feed Items
router.post('/:id/bookmark', protect, addBookmark);
router.delete('/:id/bookmark', protect, removeBookmark);

module.exports = router;

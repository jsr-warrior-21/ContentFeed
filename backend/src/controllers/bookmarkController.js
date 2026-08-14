const bookmarkService = require('../services/bookmarkService');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');

/**
 * @desc    Bookmark a content item for authenticated user
 * @route   POST /api/v1/feed/:id/bookmark
 * @access  Private
 */
const addBookmark = asyncHandler(async (req, res) => {
  const { id: contentId } = req.params;
  const userId = req.user.id;

  const bookmark = await bookmarkService.addBookmark(userId, contentId);

  res.status(201).json(
    new ApiResponse(201, bookmark, 'Content bookmarked successfully')
  );
});

/**
 * @desc    Remove a bookmark for authenticated user
 * @route   DELETE /api/v1/feed/:id/bookmark
 * @access  Private
 */
const removeBookmark = asyncHandler(async (req, res) => {
  const { id: contentId } = req.params;
  const userId = req.user.id;

  const result = await bookmarkService.removeBookmark(userId, contentId);

  res.status(200).json(
    new ApiResponse(200, result, 'Bookmark removed successfully')
  );
});

/**
 * @desc    Get all bookmarks for authenticated user
 * @route   GET /api/v1/bookmarks
 * @access  Private
 */
const getBookmarks = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const bookmarks = await bookmarkService.getUserBookmarks(userId);

  res.status(200).json(
    new ApiResponse(200, bookmarks, 'User bookmarks retrieved successfully')
  );
});

module.exports = {
  addBookmark,
  removeBookmark,
  getBookmarks,
};

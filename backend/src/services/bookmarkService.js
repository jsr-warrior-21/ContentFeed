const mongoose = require('mongoose');
const Bookmark = require('../models/Bookmark');
const Content = require('../models/Content');
const ApiError = require('../utils/ApiError');

class BookmarkService {
  /**
   * Add a bookmark for authenticated user
   * @param {string} userId 
   * @param {string} contentId 
   */
  async addBookmark(userId, contentId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(contentId)) {
        throw new ApiError(400, `Invalid content ID format: '${contentId}'`);
      }

      // Verify content exists
      const content = await Content.findById(contentId);
      if (!content) {
        throw new ApiError(404, `Content item with ID '${contentId}' not found.`);
      }

      // Check if bookmark already exists
      const existingBookmark = await Bookmark.findOne({
        user: userId,
        content: contentId,
      });

      if (existingBookmark) {
        throw new ApiError(409, 'Content item is already bookmarked by this user.');
      }

      const bookmark = await Bookmark.create({
        user: userId,
        content: contentId,
      });

      // Populate content details
      await bookmark.populate('content');

      return bookmark;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      // Handle MongoDB E11000 duplicate key error just in case race condition occurs
      if (error.code === 11000) {
        throw new ApiError(409, 'Content item is already bookmarked by this user.');
      }
      throw new ApiError(500, `Error adding bookmark: ${error.message}`);
    }
  }

  /**
   * Remove a bookmark for authenticated user
   * @param {string} userId 
   * @param {string} contentId 
   */
  async removeBookmark(userId, contentId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(contentId)) {
        throw new ApiError(400, `Invalid content ID format: '${contentId}'`);
      }

      const bookmark = await Bookmark.findOneAndDelete({
        user: userId,
        content: contentId,
      });

      if (!bookmark) {
        throw new ApiError(404, 'Bookmark not found or already removed.');
      }

      return { message: 'Bookmark removed successfully', contentId };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, `Error removing bookmark: ${error.message}`);
    }
  }

  /**
   * Get all bookmarked items for authenticated user
   * @param {string} userId 
   */
  async getUserBookmarks(userId) {
    try {
      const bookmarks = await Bookmark.find({ user: userId })
        .populate('content')
        .sort({ createdAt: -1 });

      // Transform response to return populated content objects along with bookmark metadata
      const items = bookmarks
        .filter((bm) => bm.content != null)
        .map((bm) => {
          const contentObj = bm.content.toJSON();
          return {
            bookmarkId: bm.id,
            bookmarkedAt: bm.createdAt,
            ...contentObj,
          };
        });

      return items;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, `Error fetching bookmarks: ${error.message}`);
    }
  }
}

module.exports = new BookmarkService();

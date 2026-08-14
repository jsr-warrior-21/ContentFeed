const mongoose = require('mongoose');
const Content = require('../models/Content');
const ApiError = require('../utils/ApiError');

class FeedService {
  /**
   * Fetch paginated & sorted feed content items
   * @param {object} options - { page, limit, sort }
   */
  async getFeed({ page = 1, limit = 20, sort = 'latest' }) {
    try {
      const parsedPage = Math.max(1, parseInt(page, 10) || 1);
      const parsedLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
      const skip = (parsedPage - 1) * parsedLimit;

      // Determine sort order
      let sortOption = { publishedAt: -1, _id: -1 };
      if (sort === 'oldest') {
        sortOption = { publishedAt: 1, _id: 1 };
      }

      // Execute total count and paginated query in parallel
      const [totalItems, items] = await Promise.all([
        Content.countDocuments(),
        Content.find().sort(sortOption).skip(skip).limit(parsedLimit),
      ]);

      const totalPages = Math.ceil(totalItems / parsedLimit) || 1;

      const pagination = {
        page: parsedPage,
        limit: parsedLimit,
        totalItems,
        totalPages,
        hasNextPage: parsedPage < totalPages,
        hasPrevPage: parsedPage > 1,
      };

      return {
        items,
        pagination,
      };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, `Error fetching feed items: ${error.message}`);
    }
  }

  /**
   * Fetch individual content item by ID
   * @param {string} contentId 
   */
  async getContentById(contentId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(contentId)) {
        throw new ApiError(400, `Invalid content ID format: '${contentId}'`);
      }

      const content = await Content.findById(contentId);
      if (!content) {
        throw new ApiError(404, `Content item with ID '${contentId}' not found.`);
      }

      return content;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, `Error fetching content item: ${error.message}`);
    }
  }
}

module.exports = new FeedService();

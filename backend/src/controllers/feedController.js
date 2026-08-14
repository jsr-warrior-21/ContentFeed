const feedService = require('../services/feedService');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');

/**
 * @desc    Get paginated & sorted feed content
 * @route   GET /api/v1/feed
 * @access  Public
 */
const getFeed = asyncHandler(async (req, res) => {
  const { page, limit, sort } = req.query;
  const { items, pagination } = await feedService.getFeed({ page, limit, sort });

  res.status(200).json(
    new ApiResponse(200, items, 'Feed items retrieved successfully', pagination)
  );
});

/**
 * @desc    Get single content item by ID
 * @route   GET /api/v1/feed/:id
 * @access  Public
 */
const getContentById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const content = await feedService.getContentById(id);

  res.status(200).json(
    new ApiResponse(200, content, 'Content item retrieved successfully')
  );
});

module.exports = {
  getFeed,
  getContentById,
};

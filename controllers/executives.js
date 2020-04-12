const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Executive = require('../models/Executive');

// @desc    Get all Executives - implement pagination, count
// @route   GET /api/v1/executives
// @access  Public
exports.getExecutives = asyncHandler(async (req, res, next) => {
  let query;

  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit'];

  // Loop over removeFields and delete them before from reqQuery
  removeFields.forEach((params) => delete reqQuery[params]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $lte etc)
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  // Finding resource
  query = Executive.find(JSON.parse(queryStr));

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    // query = query.sort('-createdAt');
    query = query.sort({ createdAt: -1 });
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 1;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Executive.countDocuments();

  query = query.skip(startIndex).limit(limit);

  // Executing query
  const executives = await query;

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.status(200).json({
    success: true,
    count: executives.length,
    pagination,
    data: executives,
  });
});

// @desc    Get single Executive
// @route   GET /api/v1/executives/:id
// @access  Public
exports.getExecutive = asyncHandler(async (req, res, next) => {
  const executive = await Executive.findById(req.params.id);

  if (!executive) {
    return next(
      next(
        new ErrorResponse(
          `Executive not found with id of ${req.params.id}`,
          404
        )
      )
    );
  }

  res.status(200).json({
    success: true,
    data: executive,
  });
});

// @desc    Create new Executive
// @route   POST /api/v1/executives
// @access  Private
exports.createExecutive = asyncHandler(async (req, res, next) => {
  const executive = await Executive.create(req.body);

  res.status(201).json({
    success: true,
    data: executive,
  });
});

// @desc    Update Executive
// @route   PUT /api/v1/executives/:id
// @access  Private
exports.updateExecutive = asyncHandler(async (req, res, next) => {
  const executive = await Executive.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!executive) {
    return next(
      next(
        new ErrorResponse(
          `Executive not found with id of ${req.params.id}`,
          404
        )
      )
    );
  }

  res.status(200).json({
    success: true,
    data: executive,
  });
});

// @desc    Delete Executive
// @route   DELETE /api/v1/executives/:id
// @access  Private
exports.deleteExecutive = asyncHandler(async (req, res, next) => {
  const executive = await Executive.findByIdAndDelete(req.params.id);

  if (!executive) {
    return next(
      next(
        new ErrorResponse(
          `Executive not found with id of ${req.params.id}`,
          404
        )
      )
    );
  }

  res.status(200).json({
    success: true,
    data: {},
  });
});

/**
 * Error handling middleware for Express
 * Provides consistent error response formatting and logging
 */

/**
 * Not Found Error Handler
 * Handles 404 errors when routes are not found
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * General Error Handler
 * Handles all other errors with appropriate status codes and formatting
 * @param {Object} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const errorHandler = (err, req, res, next) => {
  // Set status code (use error status or 500 if not specified)
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  // Log error for server-side debugging
  console.error(`Error: ${err.message}`);
  if (err.stack) console.error(err.stack);
  
  // Send error response
  res.status(statusCode).json({
    message: err.message,
    // Only include stack trace in development environment
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { notFound, errorHandler }; 
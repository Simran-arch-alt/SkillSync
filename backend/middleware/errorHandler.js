const AppError = require('../utils/AppError');

/**
 * Converts known Mongoose/JWT errors into AppError instances with
 * appropriate status codes and friendly messages.
 */
const normalizeError = (err) => {
  let error = err;

  // Mongoose bad ObjectId (CastError)
  if (err.name === 'CastError') {
    error = new AppError(`Invalid value for field '${err.path}': ${err.value}`, 400);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0];
    error = new AppError(
      `Duplicate value for field '${field}'. Please use another value.`,
      409
    );
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    error = new AppError(`Validation failed: ${messages.join('. ')}`, 400);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = new AppError('Invalid token. Please log in again.', 401);
  }
  if (err.name === 'TokenExpiredError') {
    error = new AppError('Your token has expired. Please log in again.', 401);
  }

  return error;
};

/**
 * Handles requests to routes that do not exist.
 */
const notFoundHandler = (req, res, next) => {
  const error = new AppError(`Route not found: ${req.originalUrl}`, 404);
  next(error);
};

/**
 * Centralized error handling middleware. Must be registered last, after all routes.
 */
const errorHandler = (err, req, res, next) => {
  let error = normalizeError(err);

  if (!(error instanceof AppError)) {
    error = new AppError(
      process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message,
      error.statusCode || 500
    );
  }

  const statusCode = error.statusCode || 500;

  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message: error.message || 'Something went wrong',
    error:
      process.env.NODE_ENV === 'production'
        ? {}
        : { stack: err.stack, details: error.details || {} },
  });
};

module.exports = { errorHandler, notFoundHandler };

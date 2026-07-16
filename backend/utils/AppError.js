/**
 * Custom error class used throughout the application for operational errors
 * (errors we anticipate and handle gracefully, e.g. validation failures,
 * not-found resources, auth failures) as opposed to programming bugs.
 */
class AppError extends Error {
  constructor(message, statusCode = 500, details = {}) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;

/**
 * Wraps an async route handler / controller function and forwards any
 * thrown errors to Express's error-handling middleware via next().
 * This avoids repetitive try/catch blocks in every controller.
 *
 * @param {Function} fn - async (req, res, next) => {}
 * @returns {Function}
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;

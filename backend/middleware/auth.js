const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');

/**
 * Protects routes by requiring a valid JWT in the Authorization header.
 * Format expected: "Authorization: Bearer <token>"
 * On success, attaches the authenticated user document to req.user.
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    throw new AppError('Not authorized. No token provided.', 401);
  }

  let decoded;
  try {
    decoded = verifyToken(token);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new AppError('Token has expired. Please log in again.', 401);
    }
    throw new AppError('Not authorized. Invalid token.', 401);
  }

  const user = await User.findById(decoded.id);

  if (!user) {
    throw new AppError('The user belonging to this token no longer exists.', 401);
  }

  req.user = user;
  next();
});

/**
 * Restricts access to specific roles. Must be used after `protect`.
 * @param {...string} roles
 */
const restrictTo = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    throw new AppError('You do not have permission to perform this action.', 403);
  }
  next();
};

module.exports = { protect, restrictTo };

const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRE } = require('../config/constants');

/**
 * Signs a JWT token for a given user ID.
 * @param {string} userId
 * @returns {string} signed JWT token
 */
const signToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRE,
  });
};

/**
 * Verifies a JWT token and returns its decoded payload.
 * Throws if the token is invalid or expired.
 * @param {string} token
 * @returns {object} decoded payload
 */
const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

module.exports = { signToken, verifyToken };

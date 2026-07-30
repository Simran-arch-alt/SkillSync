/**
 * Sends a standardized success response.
 * @param {import('express').Response} res
 * @param {number} statusCode
 * @param {string} message
 * @param {any} data
 */
const sendSuccess = (res, statusCode = 200, message = 'Success', data = {}) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Sends a standardized error response.
 * @param {import('express').Response} res
 * @param {number} statusCode
 * @param {string} message
 * @param {any} error
 */
const sendError = (res, statusCode = 500, message = 'Something went wrong', error = {}) => {
  return res.status(statusCode).json({
    success: false,
    message,
    error,
  });
};

module.exports = { sendSuccess, sendError };

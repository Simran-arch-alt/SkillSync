const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { sendSuccess } = require('../utils/apiResponse');
const { signToken } = require('../utils/jwt');

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = asyncHandler(async (req, res) => {
  const { name, email, password, university, degree, graduationYear, skills } = req.body;

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new AppError('An account with this email already exists.', 409);
  }

  const user = await User.create({
    name,
    email,
    password,
    university,
    degree,
    graduationYear,
    skills,
  });

  const token = signToken(user._id);

  return sendSuccess(res, 201, 'User registered successfully.', {
    token,
    user,
  });
});

/**
 * @desc    Log in an existing user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

  if (!user) {
    throw new AppError('Invalid email or password.', 401);
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new AppError('Invalid email or password.', 401);
  }

  const token = signToken(user._id);

  // Remove password before sending response
  user.password = undefined;

  return sendSuccess(res, 200, 'Login successful.', {
    token,
    user,
  });
});

/**
 * @desc    Get currently authenticated user
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  return sendSuccess(res, 200, 'Current user retrieved successfully.', { user });
});

module.exports = { register, login, getMe };

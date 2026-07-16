const validator = require('validator');
const mongoose = require('mongoose');
const AppError = require('../utils/AppError');

/**
 * Validates user registration payload.
 */
const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.push('Name is required and must be at least 2 characters long.');
  }

  if (!email || !validator.isEmail(email)) {
    errors.push('A valid email address is required.');
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    errors.push('Password is required and must be at least 6 characters long.');
  }

  if (req.body.graduationYear !== undefined) {
    const year = Number(req.body.graduationYear);
    if (Number.isNaN(year) || year < 1950 || year > 2100) {
      errors.push('Graduation year must be a valid year.');
    }
  }

  if (req.body.skills !== undefined && !Array.isArray(req.body.skills)) {
    errors.push('Skills must be provided as an array of strings.');
  }

  if (errors.length > 0) {
    return next(new AppError(errors.join(' '), 400));
  }

  next();
};

/**
 * Validates user login payload.
 */
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || !validator.isEmail(email)) {
    errors.push('A valid email address is required.');
  }

  if (!password || typeof password !== 'string') {
    errors.push('Password is required.');
  }

  if (errors.length > 0) {
    return next(new AppError(errors.join(' '), 400));
  }

  next();
};

/**
 * Validates that a request body contains a non-empty `skills` array of strings.
 */
const validateSkillsArray = (req, res, next) => {
  const { skills } = req.body;

  if (!skills || !Array.isArray(skills) || skills.length === 0) {
    return next(new AppError('skills must be a non-empty array of strings.', 400));
  }

  const allStrings = skills.every((s) => typeof s === 'string' && s.trim().length > 0);
  if (!allStrings) {
    return next(new AppError('Every skill must be a non-empty string.', 400));
  }

  next();
};

/**
 * Validates that :id route param is a valid Mongo ObjectId.
 */
const validateObjectId = (paramName = 'id') => (req, res, next) => {
  const id = req.params[paramName];
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new AppError(`Invalid ID format for parameter '${paramName}': ${id}`, 400));
  }
  next();
};

/**
 * Validates payload for creating a new job (admin only).
 */
const validateJobCreate = (req, res, next) => {
  const { job_title, skills } = req.body;
  const errors = [];

  if (!job_title || typeof job_title !== 'string' || job_title.trim().length === 0) {
    errors.push('job_title is required.');
  }

  if (req.body.is_remote !== undefined && typeof req.body.is_remote !== 'boolean') {
    errors.push('is_remote must be a boolean.');
  }

  if (req.body.is_aggregator !== undefined && typeof req.body.is_aggregator !== 'boolean') {
    errors.push('is_aggregator must be a boolean.');
  }

  if (skills !== undefined && !Array.isArray(skills)) {
    errors.push('skills must be an array of strings.');
  }

  if (errors.length > 0) {
    return next(new AppError(errors.join(' '), 400));
  }

  next();
};

/**
 * Validates payload for updating an existing job (admin only).
 * Same rules as create, but all fields are optional (partial update).
 */
const validateJobUpdate = (req, res, next) => {
  const errors = [];
  const { job_title, is_remote, is_aggregator, skills } = req.body;

  if (job_title !== undefined && (typeof job_title !== 'string' || job_title.trim().length === 0)) {
    errors.push('job_title must be a non-empty string.');
  }

  if (is_remote !== undefined && typeof is_remote !== 'boolean') {
    errors.push('is_remote must be a boolean.');
  }

  if (is_aggregator !== undefined && typeof is_aggregator !== 'boolean') {
    errors.push('is_aggregator must be a boolean.');
  }

  if (skills !== undefined && !Array.isArray(skills)) {
    errors.push('skills must be an array of strings.');
  }

  if (errors.length > 0) {
    return next(new AppError(errors.join(' '), 400));
  }

  next();
};

/**
 * Validates payload for an admin updating a user's role.
 */
const validateRoleUpdate = (req, res, next) => {
  const { role } = req.body;
  const allowedRoles = ['student', 'admin'];

  if (!role || !allowedRoles.includes(role)) {
    return next(new AppError(`role is required and must be one of: ${allowedRoles.join(', ')}.`, 400));
  }

  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateSkillsArray,
  validateObjectId,
  validateJobCreate,
  validateJobUpdate,
  validateRoleUpdate,
};

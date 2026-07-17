const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { sendSuccess } = require('../utils/apiResponse');
const { normalizeSkills } = require('../utils/skillMatcher');
const { execFile } = require('child_process');
const path = require('path');
const { promisify } = require('util');
const execFileAsync = promisify(execFile);

/**
 * @desc    Get logged-in student's profile
 * @route   GET /api/students/profile
 * @access  Private
 */
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new AppError('User not found.', 404);
  }
  return sendSuccess(res, 200, 'Profile retrieved successfully.', { user });
});

/**
 * @desc    Update logged-in student's profile (name, university, degree, graduationYear)
 * @route   PUT /api/students/profile
 * @access  Private
 */
const updateProfile = asyncHandler(async (req, res) => {
  const allowedFields = ['name', 'university', 'degree', 'graduationYear'];
  const updates = {};

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  if (Object.keys(updates).length === 0) {
    throw new AppError('No valid fields provided for update.', 400);
  }

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  });

  return sendSuccess(res, 200, 'Profile updated successfully.', { user });
});

/**
 * @desc    Get current skills of the logged-in student
 * @route   GET /api/students/skills
 * @access  Private
 */
const getSkills = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  return sendSuccess(res, 200, 'Skills retrieved successfully.', { skills: user.skills });
});

/**
 * @desc    Replace the entire skills list for the logged-in student
 * @route   PUT /api/students/skills
 * @access  Private
 */
const updateSkills = asyncHandler(async (req, res) => {
  const { skills } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { skills: normalizeSkills(skills) },
    { new: true, runValidators: true }
  );

  return sendSuccess(res, 200, 'Skills updated successfully.', { skills: user.skills });
});

/**
 * @desc    Add one or more skills to the logged-in student's profile
 * @route   POST /api/students/skills
 * @access  Private
 */
const addSkills = asyncHandler(async (req, res) => {
  const { skills } = req.body;

  const user = await User.findById(req.user._id);
  const merged = normalizeSkills([...user.skills, ...skills]);
  user.skills = merged;
  await user.save();

  return sendSuccess(res, 200, 'Skills added successfully.', { skills: user.skills });
});

/**
 * @desc    Remove one or more skills from the logged-in student's profile
 * @route   DELETE /api/students/skills
 * @access  Private
 * @body    { "skills": ["python", "java"] }
 */
const removeSkills = asyncHandler(async (req, res) => {
  const { skills } = req.body;
  const toRemove = new Set(normalizeSkills(skills));

  const user = await User.findById(req.user._id);
  user.skills = user.skills.filter((skill) => !toRemove.has(skill));
  await user.save();

  return sendSuccess(res, 200, 'Skills removed successfully.', { skills: user.skills });
});

/**
 * @desc    Upload resume file for the logged-in student
 * @route   POST /api/students/upload-resume
 * @access  Private
 */
const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError('No file uploaded.', 400);
  }

  const resumePath = `/uploads/${req.file.filename}`;
  const absolutePath = path.join(__dirname, '..', 'uploads', req.file.filename);

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { resume: resumePath },
    { new: true }
  );

    let extractedSkills = [];
    try {
      const parserPath = path.join(__dirname, '..', '..', 'python-engine', 'cv_parser.py');
      const { stdout } = await execFileAsync('python', [parserPath, '--file', absolutePath], {
        timeout: 15000,
        encoding: 'utf-8',
      });
      const result = JSON.parse(stdout);
      if (result.skills && result.skills.length > 0) {
        extractedSkills = normalizeSkills(result.skills);
        user.skills = extractedSkills;
        await user.save();
      }
    } catch (err) {
      console.warn('CV skill extraction skipped:', err.message);
    }

  return sendSuccess(res, 200, 'Resume uploaded successfully.', {
    resume: user.resume,
    skills: extractedSkills,
  });
});

module.exports = {
  getProfile,
  updateProfile,
  getSkills,
  updateSkills,
  addSkills,
  removeSkills,
  uploadResume,
};

const Job = require('../models/Job');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');
const { rankJobsBySkillMatch } = require('../utils/skillMatcher');
const { TOP_RECOMMENDATIONS_COUNT } = require('../config/constants');

/**
 * @desc    Get total number of jobs in the database
 * @route   GET /api/dashboard/total-jobs
 * @access  Public
 */
const getTotalJobs = asyncHandler(async (req, res) => {
  const total = await Job.countDocuments();
  return sendSuccess(res, 200, 'Total job count retrieved successfully.', { total });
});

/**
 * @desc    Get count of remote vs non-remote jobs
 * @route   GET /api/dashboard/remote-jobs
 * @access  Public
 */
const getRemoteJobs = asyncHandler(async (req, res) => {
  const [remoteCount, onsiteCount] = await Promise.all([
    Job.countDocuments({ is_remote: true }),
    Job.countDocuments({ is_remote: false }),
  ]);

  return sendSuccess(res, 200, 'Remote job statistics retrieved successfully.', {
    remote: remoteCount,
    onsite: onsiteCount,
    total: remoteCount + onsiteCount,
  });
});

/**
 * @desc    Get count of jobs grouped by role category
 * @route   GET /api/dashboard/categories
 * @access  Public
 */
const getCategoriesCount = asyncHandler(async (req, res) => {
  const categories = await Job.aggregate([
    { $group: { _id: '$role_category', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $project: { _id: 0, category: '$_id', count: 1 } },
  ]);

  return sendSuccess(res, 200, 'Category statistics retrieved successfully.', { categories });
});

/**
 * @desc    Get count of jobs grouped by seniority level
 * @route   GET /api/dashboard/seniority
 * @access  Public
 */
const getSeniorityCount = asyncHandler(async (req, res) => {
  const seniority = await Job.aggregate([
    { $group: { _id: '$seniority_level', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $project: { _id: 0, seniority: '$_id', count: 1 } },
  ]);

  return sendSuccess(res, 200, 'Seniority level statistics retrieved successfully.', {
    seniority,
  });
});

/**
 * @desc    Get most common skills across all jobs
 * @route   GET /api/dashboard/top-skills
 * @access  Public
 * @query   limit (default 20)
 */
const getMostCommonSkills = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 20;

  const topSkills = await Job.aggregate([
    { $unwind: '$skills' },
    { $group: { _id: '$skills', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: limit },
    { $project: { _id: 0, skill: '$_id', count: 1 } },
  ]);

  return sendSuccess(res, 200, 'Most common skills retrieved successfully.', { topSkills });
});

/**
 * @desc    Get top recommended jobs for the logged-in student
 * @route   GET /api/dashboard/top-recommended-jobs
 * @access  Private
 */
const getTopRecommendedJobs = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const jobs = await Job.find().lean();

  const recommendations = rankJobsBySkillMatch(user.skills, jobs, TOP_RECOMMENDATIONS_COUNT);

  return sendSuccess(res, 200, 'Top recommended jobs retrieved successfully.', {
    recommendations,
  });
});

/**
 * @desc    Get a consolidated summary of all dashboard statistics in one call
 * @route   GET /api/dashboard/summary
 * @access  Public
 */
const getDashboardSummary = asyncHandler(async (req, res) => {
  const [totalJobs, remoteCount, onsiteCount, categories, seniority, topSkills] =
    await Promise.all([
      Job.countDocuments(),
      Job.countDocuments({ is_remote: true }),
      Job.countDocuments({ is_remote: false }),
      Job.aggregate([
        { $group: { _id: '$role_category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $project: { _id: 0, category: '$_id', count: 1 } },
      ]),
      Job.aggregate([
        { $group: { _id: '$seniority_level', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $project: { _id: 0, seniority: '$_id', count: 1 } },
      ]),
      Job.aggregate([
        { $unwind: '$skills' },
        { $group: { _id: '$skills', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
        { $project: { _id: 0, skill: '$_id', count: 1 } },
      ]),
    ]);

  return sendSuccess(res, 200, 'Dashboard summary retrieved successfully.', {
    totalJobs,
    remoteJobs: { remote: remoteCount, onsite: onsiteCount },
    categories,
    seniority,
    topSkills,
  });
});

module.exports = {
  getTotalJobs,
  getRemoteJobs,
  getCategoriesCount,
  getSeniorityCount,
  getMostCommonSkills,
  getTopRecommendedJobs,
  getDashboardSummary,
};

const Job = require('../models/Job');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { sendSuccess } = require('../utils/apiResponse');
const { DEFAULT_PAGE, DEFAULT_LIMIT, MAX_LIMIT } = require('../config/constants');

/**
 * Parses and sanitizes pagination query params.
 */
const getPagination = (query) => {
  let page = parseInt(query.page, 10) || DEFAULT_PAGE;
  let limit = parseInt(query.limit, 10) || DEFAULT_LIMIT;

  if (page < 1) page = DEFAULT_PAGE;
  if (limit < 1) limit = DEFAULT_LIMIT;
  if (limit > MAX_LIMIT) limit = MAX_LIMIT;

  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

/**
 * Parses sort query param, e.g. "job_title", "-createdAt".
 * Defaults to newest first.
 */
const getSort = (sortParam) => {
  if (!sortParam) return { createdAt: -1 };

  const sortObj = {};
  sortParam.split(',').forEach((field) => {
    if (field.startsWith('-')) {
      sortObj[field.substring(1)] = -1;
    } else {
      sortObj[field] = 1;
    }
  });
  return sortObj;
};

/**
 * @desc    Get all jobs with pagination and sorting
 * @route   GET /api/jobs
 * @access  Public
 */
const getJobs = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const sort = getSort(req.query.sort);

  const [jobs, total] = await Promise.all([
    Job.find().sort(sort).skip(skip).limit(limit),
    Job.countDocuments(),
  ]);

  return sendSuccess(res, 200, 'Jobs retrieved successfully.', {
    jobs,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
});

/**
 * @desc    Get a single job by ID
 * @route   GET /api/jobs/:id
 * @access  Public
 */
const getJobById = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    throw new AppError('Job not found.', 404);
  }

  return sendSuccess(res, 200, 'Job retrieved successfully.', { job });
});

/**
 * @desc    Search jobs by keyword, location, remote status, category, seniority
 * @route   GET /api/jobs/search
 * @access  Public
 * @query   keyword, location, remote, category, seniority, page, limit, sort
 */
const searchJobs = asyncHandler(async (req, res) => {
  const { keyword, location, remote, category, seniority } = req.query;
  const { page, limit, skip } = getPagination(req.query);
  const sort = getSort(req.query.sort);

  const filter = {};

  if (keyword) {
    filter.$or = [
      { job_title: { $regex: keyword, $options: 'i' } },
      { company: { $regex: keyword, $options: 'i' } },
      { skills: { $regex: keyword, $options: 'i' } },
    ];
  }

  if (location) {
    filter.location = { $regex: location, $options: 'i' };
  }

  if (remote !== undefined) {
    filter.is_remote = remote === 'true' || remote === true;
  }

  if (category) {
    filter.role_category = { $regex: `^${category}$`, $options: 'i' };
  }

  if (seniority) {
    filter.seniority_level = { $regex: `^${seniority}$`, $options: 'i' };
  }

  const [jobs, total] = await Promise.all([
    Job.find(filter).sort(sort).skip(skip).limit(limit),
    Job.countDocuments(filter),
  ]);

  return sendSuccess(res, 200, 'Job search completed successfully.', {
    jobs,
    filters: { keyword, location, remote, category, seniority },
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
});

/**
 * @desc    Get aggregated role summaries with descriptions
 * @route   GET /api/jobs/roles/summary
 * @access  Public
 */
const getRolesSummary = asyncHandler(async (req, res) => {
  const roles = await Job.aggregate([
    {
      $group: {
        _id: '$job_title',
        count: { $sum: 1 },
        category: { $first: '$role_category' },
        companies: { $addToSet: '$company' },
        seniority: { $addToSet: '$seniority_level' },
        skills: { $push: '$skills' },
      },
    },
    { $sort: { count: -1 } },
  ]);

  const summary = roles
    .filter((r) => r._id)
    .map((r) => {
      const allSkills = [...new Set(r.skills.flat().filter(Boolean))];
      const topSkills = allSkills.slice(0, 10);
      const seniorityList = r.seniority.filter((s) => s && s !== 'not specified');

      const parts = [`${r.count} job listing${r.count > 1 ? 's' : ''}`];
      if (r.category && r.category !== 'uncategorized') {
        parts.push(`in ${r.category}`);
      }
      if (seniorityList.length > 0) {
        parts.push(`(${seniorityList.join(', ')})`);
      }
      const description = parts.join(' ');

      return {
        title: r._id,
        category: r.category || '',
        count: r.count,
        companies: r.companies.slice(0, 5),
        skills: topSkills,
        allSkills,
        seniority: seniorityList,
        description,
      };
    });

  return sendSuccess(res, 200, 'Role summaries retrieved successfully.', { roles: summary });
});

module.exports = { getJobs, getJobById, searchJobs, getRolesSummary };

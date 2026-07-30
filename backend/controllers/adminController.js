const path = require('path');
const Job = require('../models/Job');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { sendSuccess } = require('../utils/apiResponse');
const { normalizeSkills } = require('../utils/skillMatcher');
const { DEFAULT_PAGE, DEFAULT_LIMIT, MAX_LIMIT } = require('../config/constants');

const getPagination = (query) => {
  let page = parseInt(query.page, 10) || DEFAULT_PAGE;
  let limit = parseInt(query.limit, 10) || DEFAULT_LIMIT;

  if (page < 1) page = DEFAULT_PAGE;
  if (limit < 1) limit = DEFAULT_LIMIT;
  if (limit > MAX_LIMIT) limit = MAX_LIMIT;

  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

/* ------------------------------------------------------------------ */
/*  JOB MANAGEMENT (Admin)                                             */
/* ------------------------------------------------------------------ */

/**
 * @desc    Create a new job posting
 * @route   POST /api/admin/jobs
 * @access  Private/Admin
 */
const createJob = asyncHandler(async (req, res) => {
  const {
    job_title,
    company,
    location,
    is_remote,
    role_category,
    seniority_level,
    is_aggregator,
    skills,
  } = req.body;

  const job = await Job.create({
    job_title,
    company,
    location,
    is_remote,
    role_category,
    seniority_level,
    is_aggregator,
    skills: normalizeSkills(skills),
  });

  return sendSuccess(res, 201, 'Job created successfully.', { job });
});

/**
 * @desc    Update an existing job posting (partial update supported)
 * @route   PUT /api/admin/jobs/:id
 * @access  Private/Admin
 */
const updateJob = asyncHandler(async (req, res) => {
  const allowedFields = [
    'job_title',
    'company',
    'location',
    'is_remote',
    'role_category',
    'seniority_level',
    'is_aggregator',
    'skills',
  ];

  const updates = {};
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = field === 'skills' ? normalizeSkills(req.body[field]) : req.body[field];
    }
  });

  if (Object.keys(updates).length === 0) {
    throw new AppError('No valid fields provided for update.', 400);
  }

  const job = await Job.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });

  if (!job) {
    throw new AppError('Job not found.', 404);
  }

  return sendSuccess(res, 200, 'Job updated successfully.', { job });
});

/**
 * @desc    Delete a single job posting
 * @route   DELETE /api/admin/jobs/:id
 * @access  Private/Admin
 */
const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findByIdAndDelete(req.params.id);

  if (!job) {
    throw new AppError('Job not found.', 404);
  }

  return sendSuccess(res, 200, 'Job deleted successfully.', { job });
});

/**
 * @desc    Bulk delete all job postings (dangerous — used mainly before a re-import)
 * @route   DELETE /api/admin/jobs
 * @access  Private/Admin
 */
const deleteAllJobs = asyncHandler(async (req, res) => {
  const result = await Job.deleteMany({});
  return sendSuccess(res, 200, 'All jobs deleted successfully.', {
    deletedCount: result.deletedCount,
  });
});

/**
 * @desc    Trigger a re-import of the bundled CSV dataset into MongoDB
 * @route   POST /api/admin/jobs/import
 * @access  Private/Admin
 * @body    { "fresh": true } - optional, wipes existing jobs first
 */
const importJobsFromCsv = asyncHandler(async (req, res) => {
  const fs = require('fs');
  const csv = require('csv-parser');

  const csvPath = path.join(__dirname, '..', 'dataset', 'jobs.csv');

  if (!fs.existsSync(csvPath)) {
    throw new AppError('Dataset CSV not found on the server.', 404);
  }

  const fresh = req.body.fresh === true;

  const parseBoolean = (value) => {
    if (typeof value === 'boolean') return value;
    if (!value) return false;
    const normalized = String(value).trim().toLowerCase();
    return normalized === 'yes' || normalized === 'true' || normalized === '1';
  };

  const rows = await new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (row) => results.push(row))
      .on('end', () => resolve(results))
      .on('error', reject);
  });

  const jobs = rows.map((row) => ({
    job_title: (row.job_title || '').trim() || 'Untitled Role',
    company: (row.company || '').trim() || 'Unknown',
    location: (row.location || '').trim() || 'Not specified',
    is_remote: parseBoolean(row.is_remote),
    role_category: (row.role_category || '').trim().toLowerCase() || 'uncategorized',
    seniority_level: (row.seniority_level || '').trim().toLowerCase() || 'not specified',
    is_aggregator: parseBoolean(row.is_aggregator),
    skills: normalizeSkills(String(row.skills_str || '').split(',')),
  }));

  let deletedCount = 0;
  if (fresh) {
    const deleted = await Job.deleteMany({});
    deletedCount = deleted.deletedCount;
  }

  const inserted = await Job.insertMany(jobs, { ordered: false });

  return sendSuccess(res, 201, 'Jobs imported successfully.', {
    deletedCount,
    insertedCount: inserted.length,
  });
});

/* ------------------------------------------------------------------ */
/*  USER MANAGEMENT (Admin)                                            */
/* ------------------------------------------------------------------ */

/**
 * @desc    Get all users (paginated, optionally filtered by role)
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
const getAllUsers = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = {};

  if (req.query.role) {
    filter.role = req.query.role;
  }

  const [users, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(filter),
  ]);

  return sendSuccess(res, 200, 'Users retrieved successfully.', {
    users,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
});

/**
 * @desc    Get a single user by ID
 * @route   GET /api/admin/users/:id
 * @access  Private/Admin
 */
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new AppError('User not found.', 404);
  }

  return sendSuccess(res, 200, 'User retrieved successfully.', { user });
});

/**
 * @desc    Update a user's role (promote to admin / demote to student)
 * @route   PUT /api/admin/users/:id/role
 * @access  Private/Admin
 */
const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;

  if (req.params.id === String(req.user._id) && role !== 'admin') {
    throw new AppError('You cannot revoke your own admin privileges.', 400);
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true, runValidators: true }
  );

  if (!user) {
    throw new AppError('User not found.', 404);
  }

  return sendSuccess(res, 200, `User role updated to '${role}' successfully.`, { user });
});

/**
 * @desc    Toggle a user's status between active and suspended
 * @route   PUT /api/admin/users/:id/status
 * @access  Private/Admin
 */
const toggleUserStatus = asyncHandler(async (req, res) => {
  if (req.params.id === String(req.user._id)) {
    throw new AppError('You cannot suspend your own account.', 400);
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    throw new AppError('User not found.', 404);
  }

  user.status = user.status === 'active' ? 'suspended' : 'active';
  await user.save();

  return sendSuccess(res, 200, `User ${user.status === 'suspended' ? 'suspended' : 'activated'} successfully.`, { user });
});

/**
 * @desc    Delete a user account
 * @route   DELETE /api/admin/users/:id
 * @access  Private/Admin
 */
const deleteUser = asyncHandler(async (req, res) => {
  if (req.params.id === String(req.user._id)) {
    throw new AppError('You cannot delete your own account from the admin panel.', 400);
  }

  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    throw new AppError('User not found.', 404);
  }

  return sendSuccess(res, 200, 'User deleted successfully.', { user });
});

/* ------------------------------------------------------------------ */
/*  ADMIN DASHBOARD                                                     */
/* ------------------------------------------------------------------ */

/**
 * @desc    Get admin-level overview stats (users + jobs)
 * @route   GET /api/admin/stats
 * @access  Private/Admin
 */
const getAdminStats = asyncHandler(async (req, res) => {
  const [totalUsers, totalStudents, totalAdmins, totalJobs, remoteJobs, aggregatorJobs] =
    await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'admin' }),
      Job.countDocuments(),
      Job.countDocuments({ is_remote: true }),
      Job.countDocuments({ is_aggregator: true }),
    ]);

  return sendSuccess(res, 200, 'Admin statistics retrieved successfully.', {
    users: { total: totalUsers, students: totalStudents, admins: totalAdmins },
    jobs: { total: totalJobs, remote: remoteJobs, aggregator: aggregatorJobs },
  });
});

/**
 * @desc    Get user registration trends grouped by month
 * @route   GET /api/admin/registration-trends
 * @access  Private/Admin
 */
const getRegistrationTrends = asyncHandler(async (req, res) => {
  const result = await User.aggregate([
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  const monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const trends = result.map((r) => ({
    month: monthNames[r._id.month],
    year: r._id.year,
    count: r.count,
  }));

  return sendSuccess(res, 200, 'Registration trends retrieved successfully.', { trends });
});

/**
 * @desc    Get all skills across all jobs with counts
 * @route   GET /api/admin/skills
 * @access  Private/Admin
 */
const getAllSkills = asyncHandler(async (req, res) => {
  const result = await Job.aggregate([
    { $unwind: '$skills' },
    { $group: { _id: '$skills', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  const skills = result.map((r) => ({
    name: r._id,
    count: r.count,
  }));

  return sendSuccess(res, 200, 'Skills retrieved successfully.', { skills });
});

module.exports = {
  createJob,
  updateJob,
  deleteJob,
  deleteAllJobs,
  importJobsFromCsv,
  getAllUsers,
  getUserById,
  updateUserRole,
  toggleUserStatus,
  deleteUser,
  getAdminStats,
  getRegistrationTrends,
  getAllSkills,
};

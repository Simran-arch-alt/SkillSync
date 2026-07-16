const express = require('express');
const {
  createJob,
  updateJob,
  deleteJob,
  deleteAllJobs,
  importJobsFromCsv,
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
  getAdminStats,
} = require('../controllers/adminController');
const { protect, restrictTo } = require('../middleware/auth');
const {
  validateJobCreate,
  validateJobUpdate,
  validateRoleUpdate,
  validateObjectId,
} = require('../middleware/validate');

const router = express.Router();

// Every route below requires a logged-in admin
router.use(protect, restrictTo('admin'));

// ----- Admin dashboard -----
router.get('/stats', getAdminStats);

// ----- Job management -----
router.post('/jobs', validateJobCreate, createJob);
router.put('/jobs/:id', validateObjectId('id'), validateJobUpdate, updateJob);
router.delete('/jobs/:id', validateObjectId('id'), deleteJob);
router.delete('/jobs', deleteAllJobs);
router.post('/jobs/import', importJobsFromCsv);

// ----- User management -----
router.get('/users', getAllUsers);
router.get('/users/:id', validateObjectId('id'), getUserById);
router.put('/users/:id/role', validateObjectId('id'), validateRoleUpdate, updateUserRole);
router.delete('/users/:id', validateObjectId('id'), deleteUser);

module.exports = router;

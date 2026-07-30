const express = require('express');
const {
  getTotalJobs,
  getRemoteJobs,
  getCategoriesCount,
  getSeniorityCount,
  getMostCommonSkills,
  getTopRecommendedJobs,
  getDashboardSummary,
} = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/summary', getDashboardSummary);
router.get('/total-jobs', getTotalJobs);
router.get('/remote-jobs', getRemoteJobs);
router.get('/categories', getCategoriesCount);
router.get('/seniority', getSeniorityCount);
router.get('/top-skills', getMostCommonSkills);
router.get('/top-recommended-jobs', protect, getTopRecommendedJobs);

module.exports = router;

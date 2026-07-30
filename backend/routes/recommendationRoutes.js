const express = require('express');
const {
  getRecommendations,
  getMyRecommendations,
  getSkillGapForJob,
  getAdvancedRecommendations,
} = require('../controllers/recommendationController');
const { protect } = require('../middleware/auth');
const { validateSkillsArray, validateObjectId } = require('../middleware/validate');

const router = express.Router();

// Public: recommend careers for an arbitrary skill set
router.post('/', validateSkillsArray, getRecommendations);

// Private: recommend careers based on the logged-in student's saved profile
router.get('/me', protect, getMyRecommendations);

// Private: detailed skill gap analysis against a specific job
router.get('/gap/:jobId', protect, validateObjectId('jobId'), getSkillGapForJob);

// Public: advanced recommendations using Python rule engine + DAG learning path
router.post('/advanced', validateSkillsArray, getAdvancedRecommendations);

module.exports = router;

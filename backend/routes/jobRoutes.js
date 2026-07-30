const express = require('express');
const { getJobs, getJobById, searchJobs, getRolesSummary } = require('../controllers/jobController');
const { validateObjectId } = require('../middleware/validate');

const router = express.Router();

// IMPORTANT: /search and /roles/summary must be declared before /:id to avoid being
// captured by the dynamic :id route.
router.get('/roles/summary', getRolesSummary);
router.get('/search', searchJobs);
router.get('/', getJobs);
router.get('/:id', validateObjectId('id'), getJobById);

module.exports = router;

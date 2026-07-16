const express = require('express');
const { getJobs, getJobById, searchJobs } = require('../controllers/jobController');
const { validateObjectId } = require('../middleware/validate');

const router = express.Router();

// IMPORTANT: /search must be declared before /:id to avoid being
// captured by the dynamic :id route.
router.get('/search', searchJobs);
router.get('/', getJobs);
router.get('/:id', validateObjectId('id'), getJobById);

module.exports = router;

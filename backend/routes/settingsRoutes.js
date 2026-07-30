const express = require('express');
const { getSettings, updateSettings } = require('../controllers/settingsController');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

router.use(protect, restrictTo('admin'));

router.get('/', getSettings);
router.put('/', updateSettings);

module.exports = router;

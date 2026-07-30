const express = require('express');
const {
  getProfile,
  updateProfile,
  getSkills,
  updateSkills,
  addSkills,
  removeSkills,
  uploadResume,
} = require('../controllers/studentController');
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
} = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');
const { validateSkillsArray, validateObjectId } = require('../middleware/validate');
const upload = require('../utils/upload');

const router = express.Router();

// All student routes require authentication
router.use(protect);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);

router.get('/skills', getSkills);
router.put('/skills', validateSkillsArray, updateSkills);
router.post('/skills', validateSkillsArray, addSkills);
router.delete('/skills', validateSkillsArray, removeSkills);

router.post('/upload-resume', upload.single('resume'), uploadResume);

router.get('/notifications', getNotifications);
router.put('/notifications/read-all', markAllAsRead);
router.put('/notifications/:id/read', validateObjectId('id'), markAsRead);

module.exports = router;

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
const { protect } = require('../middleware/auth');
const { validateSkillsArray } = require('../middleware/validate');
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

module.exports = router;

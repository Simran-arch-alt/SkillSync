const express = require('express');
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  createNotification,
  deleteNotification,
} = require('../controllers/notificationController');
const { protect, restrictTo } = require('../middleware/auth');
const { validateObjectId } = require('../middleware/validate');

const router = express.Router();

router.use(protect, restrictTo('admin'));

router.get('/', getNotifications);
router.post('/', createNotification);
router.put('/read-all', markAllAsRead);
router.put('/:id/read', validateObjectId('id'), markAsRead);
router.delete('/:id', validateObjectId('id'), deleteNotification);

module.exports = router;

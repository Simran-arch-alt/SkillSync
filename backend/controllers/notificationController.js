const Notification = require('../models/Notification');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { sendSuccess } = require('../utils/apiResponse');

/**
 * @desc    Get all notifications (newest first)
 * @route   GET /api/notifications
 * @access  Private/Admin
 */
const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find()
    .sort({ createdAt: -1 })
    .limit(50);

  const unreadCount = await Notification.countDocuments({ read: false });

  return sendSuccess(res, 200, 'Notifications retrieved successfully.', {
    notifications,
    unreadCount,
  });
});

/**
 * @desc    Mark a notification as read
 * @route   PUT /api/notifications/:id/read
 * @access  Private/Admin
 */
const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findByIdAndUpdate(
    req.params.id,
    { read: true },
    { new: true }
  );

  if (!notification) {
    throw new AppError('Notification not found.', 404);
  }

  return sendSuccess(res, 200, 'Notification marked as read.', { notification });
});

/**
 * @desc    Mark all notifications as read
 * @route   PUT /api/notifications/read-all
 * @access  Private/Admin
 */
const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ read: false }, { read: true });
  return sendSuccess(res, 200, 'All notifications marked as read.', {});
});

/**
 * @desc    Create a notification
 * @route   POST /api/notifications
 * @access  Private/Admin
 */
const createNotification = asyncHandler(async (req, res) => {
  const { title, description, type } = req.body;

  const notification = await Notification.create({ title, description, type });

  return sendSuccess(res, 201, 'Notification created successfully.', { notification });
});

/**
 * @desc    Delete a notification
 * @route   DELETE /api/notifications/:id
 * @access  Private/Admin
 */
const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findByIdAndDelete(req.params.id);

  if (!notification) {
    throw new AppError('Notification not found.', 404);
  }

  return sendSuccess(res, 200, 'Notification deleted successfully.', { notification });
});

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  createNotification,
  deleteNotification,
};

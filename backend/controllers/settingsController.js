const AdminSettings = require('../models/AdminSettings');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');

const DEFAULT_SETTINGS = {
  notifications: {
    email: true,
    registration: true,
    skillLibrary: true,
    reports: true,
    security: true,
    maintenance: false,
    emailDelivery: true,
    inApp: true,
    sms: false,
  },
  privacy: {
    showEmail: true,
    allowContact: true,
    profileVisibility: true,
    securityAlerts: true,
  },
  twoFactorEnabled: false,
};

/**
 * @desc    Get admin settings (creates default if none exists)
 * @route   GET /api/admin/settings
 * @access  Private/Admin
 */
const getSettings = asyncHandler(async (req, res) => {
  let settings = await AdminSettings.findOne();
  if (!settings) {
    settings = await AdminSettings.create(DEFAULT_SETTINGS);
  }
  return sendSuccess(res, 200, 'Settings retrieved successfully.', { settings });
});

/**
 * @desc    Update admin settings
 * @route   PUT /api/admin/settings
 * @access  Private/Admin
 */
const updateSettings = asyncHandler(async (req, res) => {
  let settings = await AdminSettings.findOne();

  if (!settings) {
    settings = await AdminSettings.create({ ...DEFAULT_SETTINGS, ...req.body });
  } else {
    if (req.body.notifications) {
      settings.notifications = { ...settings.notifications, ...req.body.notifications };
    }
    if (req.body.privacy) {
      settings.privacy = { ...settings.privacy, ...req.body.privacy };
    }
    if (req.body.twoFactorEnabled !== undefined) {
      settings.twoFactorEnabled = req.body.twoFactorEnabled;
    }
    await settings.save();
  }

  return sendSuccess(res, 200, 'Settings updated successfully.', { settings });
});

module.exports = { getSettings, updateSettings };

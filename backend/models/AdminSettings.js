const mongoose = require('mongoose');

const AdminSettingsSchema = new mongoose.Schema(
  {
    notifications: {
      email: { type: Boolean, default: true },
      registration: { type: Boolean, default: true },
      skillLibrary: { type: Boolean, default: true },
      reports: { type: Boolean, default: true },
      security: { type: Boolean, default: true },
      maintenance: { type: Boolean, default: false },
      emailDelivery: { type: Boolean, default: true },
      inApp: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
    },
    privacy: {
      showEmail: { type: Boolean, default: true },
      allowContact: { type: Boolean, default: true },
      profileVisibility: { type: Boolean, default: true },
      securityAlerts: { type: Boolean, default: true },
    },
    twoFactorEnabled: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('AdminSettings', AdminSettingsSchema);

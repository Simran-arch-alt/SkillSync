const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema(
  {
    job_title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      index: true,
    },
    company: {
      type: String,
      trim: true,
      default: 'Unknown',
    },
    location: {
      type: String,
      trim: true,
      default: 'Not specified',
    },
    is_remote: {
      type: Boolean,
      default: false,
    },
    role_category: {
      type: String,
      trim: true,
      lowercase: true,
      index: true,
      default: 'uncategorized',
    },
    seniority_level: {
      type: String,
      trim: true,
      lowercase: true,
      default: 'not specified',
    },
    is_aggregator: {
      type: Boolean,
      default: false,
    },
    skills: {
      type: [String],
      default: [],
      set: (skillsArray) =>
        Array.isArray(skillsArray)
          ? [...new Set(skillsArray.map((s) => String(s).trim().toLowerCase()).filter(Boolean))]
          : [],
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Text index to support keyword search across title, company, location
JobSchema.index({ job_title: 'text', company: 'text', location: 'text' });

module.exports = mongoose.model('Job', JobSchema);

const { spawn } = require('child_process');
const path = require('path');
const Job = require('../models/Job');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { sendSuccess } = require('../utils/apiResponse');
const { rankJobsBySkillMatch, computeSkillGap } = require('../utils/skillMatcher');
const { TOP_RECOMMENDATIONS_COUNT } = require('../config/constants');

/**
 * @desc    Get career recommendations for an arbitrary skill set (no login required)
 * @route   POST /api/recommendations
 * @access  Public
 * @body    { "skills": ["Java", "Spring Boot", "Git", "SQL"] }
 */
const getRecommendations = asyncHandler(async (req, res) => {
  const { skills } = req.body;

  const jobs = await Job.find().lean();

  const recommendations = rankJobsBySkillMatch(skills, jobs, TOP_RECOMMENDATIONS_COUNT);

  return sendSuccess(res, 200, 'Career recommendations generated successfully.', {
    inputSkills: skills,
    totalJobsEvaluated: jobs.length,
    recommendations,
  });
});

/**
 * @desc    Get career recommendations for the logged-in student, based on their saved profile skills
 * @route   GET /api/recommendations/me
 * @access  Private
 */
const getMyRecommendations = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const jobs = await Job.find().lean();

  const recommendations = rankJobsBySkillMatch(user.skills, jobs, TOP_RECOMMENDATIONS_COUNT);

  return sendSuccess(res, 200, 'Personalized career recommendations generated successfully.', {
    studentSkills: user.skills,
    totalJobsEvaluated: jobs.length,
    recommendations,
  });
});

/**
 * @desc    Get the detailed skill gap analysis for the logged-in student against a specific job
 * @route   GET /api/recommendations/gap/:jobId
 * @access  Private
 */
const getSkillGapForJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.jobId).lean();
  if (!job) {
    throw new AppError('Job not found.', 404);
  }

  const user = await User.findById(req.user._id);
  const { matchedSkills, missingSkills, score } = computeSkillGap(user.skills, job.skills);

  return sendSuccess(res, 200, 'Skill gap analysis generated successfully.', {
    job: job.job_title,
    company: job.company,
    score,
    matchedSkills,
    missingSkills,
  });
});

/**
 * @desc    Get advanced recommendations using the Python rule engine + DAG learning path
 * @route   POST /api/recommendations/advanced
 * @access  Public
 * @body    { "skills": ["Python", "SQL", "Docker"] }
 */
const getAdvancedRecommendations = asyncHandler(async (req, res) => {
  const { skills } = req.body;

  const pythonScript = path.join(__dirname, '..', '..', 'python-engine', 'rule_recommender.py');
  const skillsArg = skills.join(', ');

  const child = spawn('python', [pythonScript, '--skills', skillsArg]);

  let stdout = '';
  let stderr = '';

  child.stdout.on('data', (data) => {
    stdout += data.toString();
  });

  child.stderr.on('data', (data) => {
    stderr += data.toString();
  });

  child.on('close', (code) => {
    if (code !== 0) {
      return sendSuccess(res, 500, 'Python rule engine failed.', { error: stderr || 'Unknown error' });
    }
    try {
      const result = JSON.parse(stdout);
      return sendSuccess(res, 200, 'Advanced recommendations generated successfully.', result);
    } catch {
      return sendSuccess(res, 500, 'Failed to parse Python engine output.', { raw: stdout });
    }
  });
});

module.exports = { getRecommendations, getMyRecommendations, getSkillGapForJob, getAdvancedRecommendations };

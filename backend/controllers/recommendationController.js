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
  const limit = parseInt(req.query.limit, 10) || TOP_RECOMMENDATIONS_COUNT;

  const jobs = await Job.find().lean();

  const recommendations = rankJobsBySkillMatch(skills, jobs, limit);

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
 * @desc    Get advanced recommendations using Python engine (Flask API)
 * @route   POST /api/recommendations/advanced
 * @access  Public
 * @body    { "skills": ["Python", "SQL", "Docker"] }
 */
const getAdvancedRecommendations = asyncHandler(async (req, res) => {
  const { skills } = req.body;
  const pyengineUrl = process.env.PYENGINE_URL || 'http://localhost:5001';
  const errors = [];

  let ruleResult = null;
  try {
    const response = await fetch(`${pyengineUrl}/recommend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skills }),
    });
    if (!response.ok) {
      const text = await response.text();
      errors.push(`Python engine error: ${text}`);
    } else {
      ruleResult = await response.json();
    }
  } catch (err) {
    errors.push(`Failed to reach python-engine: ${err.message}`);
  }

  let topMatches = null;
  try {
    const response = await fetch(`${pyengineUrl}/skill-match`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skills }),
    });
    if (response.ok) {
      topMatches = await response.json();
    }
  } catch (err) {
    // skill-match failure is non-critical
  }

  return sendSuccess(res, 200, 'Advanced recommendations generated successfully.', {
    topMatches: topMatches ? topMatches.results : [],
    ruleRecommendations: ruleResult ? ruleResult.rule_recommendations.rules : [],
    learningPath: ruleResult ? ruleResult.learning_path : [],
    learningPathDetails: ruleResult ? ruleResult.learning_path_details : [],
    summary: ruleResult ? ruleResult.summary : null,
    errors: errors.length > 0 ? errors : null,
  });
});

/**
 * @desc    Get curriculum details for a skill from Python engine
 * @route   GET /api/recommendations/curriculum/:skill
 * @access  Public
 */
const getCurriculumForSkill = asyncHandler(async (req, res) => {
  const { skill } = req.params;
  const pyengineUrl = process.env.PYENGINE_URL || 'http://localhost:5001';
  const response = await fetch(`${pyengineUrl}/curriculum/${encodeURIComponent(skill)}`);
  if (!response.ok) {
    throw new AppError(`Curriculum not found for skill: ${skill}`, 404);
  }
  const data = await response.json();
  return sendSuccess(res, 200, 'Curriculum retrieved successfully.', data);
});

/**
 * @desc    Get enriched resources (curriculum, YouTube, books) for a skill
 * @route   GET /api/recommendations/resources/:skill
 * @access  Public
 */
const getSkillResources = asyncHandler(async (req, res) => {
  const { skill } = req.params;
  const pyengineUrl = process.env.PYENGINE_URL || 'http://localhost:5001';
  const response = await fetch(`${pyengineUrl}/resources/${encodeURIComponent(skill)}`);
  if (!response.ok) {
    throw new AppError(`Resources not found for skill: ${skill}`, 404);
  }
  const data = await response.json();
  return sendSuccess(res, 200, 'Resources retrieved successfully.', data);
});

module.exports = { getRecommendations, getMyRecommendations, getSkillGapForJob, getAdvancedRecommendations, getCurriculumForSkill, getSkillResources };

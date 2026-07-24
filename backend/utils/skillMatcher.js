/**
 * Normalizes a list of skills: trims whitespace, lowercases, removes empties/duplicates.
 * @param {string[]} skills
 * @returns {string[]}
 */
const normalizeSkills = (skills = []) => {
  if (!Array.isArray(skills)) return [];
  const cleaned = skills
    .map((skill) => String(skill).trim().toLowerCase())
    .filter((skill) => skill.length > 0);
  return [...new Set(cleaned)];
};

/**
 * Compares a student's skill set against a job's required skill set.
 *
 * matchedSkills = intersection(studentSkills, jobSkills)
 * missingSkills = jobSkills - studentSkills
 * score = (matchedSkills.length / jobSkills.length) * 100
 *
 * @param {string[]} studentSkills
 * @param {string[]} jobSkills
 * @returns {{matchedSkills: string[], missingSkills: string[], score: number}}
 */
const computeSkillGap = (studentSkills = [], jobSkills = []) => {
  const normalizedStudentSkills = normalizeSkills(studentSkills);
  const normalizedJobSkills = normalizeSkills(jobSkills);

  const studentSkillSet = new Set(normalizedStudentSkills);

  const matchedSkills = normalizedJobSkills.filter((skill) => studentSkillSet.has(skill));
  const missingSkills = normalizedJobSkills.filter((skill) => !studentSkillSet.has(skill));

  const MIN_REQUIRED_SKILLS = 3;
  const pct = normalizedJobSkills.length > 0
    ? (matchedSkills.length / normalizedJobSkills.length) * 100
    : 0;
  const weight = Math.min(1, normalizedJobSkills.length / MIN_REQUIRED_SKILLS);
  const score = Math.round(pct * weight * 100) / 100;

  return { matchedSkills, missingSkills, score };
};

/**
 * Given a student's skills and a list of job documents, returns the jobs
 * ranked by descending match score, along with matched/missing skill breakdowns.
 *
 * @param {string[]} studentSkills
 * @param {Array<object>} jobs - array of job documents (plain objects or mongoose docs)
 * @param {number} topN - number of top recommendations to return
 * @returns {Array<object>}
 */
const rankJobsBySkillMatch = (studentSkills, jobs, topN = 10) => {
  const recommendations = jobs.map((job) => {
    const jobSkills = job.skills || [];
    const { matchedSkills, missingSkills, score } = computeSkillGap(studentSkills, jobSkills);

    return {
      jobId: job._id,
      job: job.job_title,
      company: job.company,
      location: job.location,
      is_remote: job.is_remote,
      role_category: job.role_category,
      seniority_level: job.seniority_level,
      score,
      matchedSkills,
      missingSkills,
    };
  });

  recommendations.sort((a, b) => b.score - a.score);

  return topN ? recommendations.slice(0, topN) : recommendations;
};

module.exports = { normalizeSkills, computeSkillGap, rankJobsBySkillMatch };

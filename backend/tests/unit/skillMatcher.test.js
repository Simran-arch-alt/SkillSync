const { normalizeSkills, computeSkillGap, rankJobsBySkillMatch } = require('../../utils/skillMatcher');

describe('normalizeSkills', () => {
  test('returns empty array for non-array input', () => {
    expect(normalizeSkills(null)).toEqual([]);
    expect(normalizeSkills(undefined)).toEqual([]);
    expect(normalizeSkills('string')).toEqual([]);
    expect(normalizeSkills(123)).toEqual([]);
  });

  test('trims, lowercases, and deduplicates skills', () => {
    expect(normalizeSkills(['  Python  ', 'python', 'PYTHON'])).toEqual(['python']);
  });

  test('filters out empty strings', () => {
    expect(normalizeSkills(['python', '', '  ', 'java'])).toEqual(['python', 'java']);
  });

  test('handles mixed valid and invalid entries', () => {
    expect(normalizeSkills(['  SQL  ', '', 'Python', 'python'])).toEqual(['sql', 'python']);
  });
});

describe('computeSkillGap', () => {
  test('returns all skills as missing when student has none', () => {
    const result = computeSkillGap([], ['python', 'java']);
    expect(result.matchedSkills).toEqual([]);
    expect(result.missingSkills).toEqual(['python', 'java']);
    expect(result.score).toBe(0);
  });

  test('returns full match when student has all required skills', () => {
    const result = computeSkillGap(['python', 'java'], ['python', 'java']);
    expect(result.matchedSkills).toEqual(['python', 'java']);
    expect(result.missingSkills).toEqual([]);
    expect(result.score).toBe(100);
  });

  test('computes partial match correctly', () => {
    const result = computeSkillGap(['python'], ['python', 'java', 'sql']);
    expect(result.matchedSkills).toEqual(['python']);
    expect(result.missingSkills).toEqual(['java', 'sql']);
    expect(result.score).toBeCloseTo(33.33, 1);
  });

  test('handles case-insensitive matching', () => {
    const result = computeSkillGap(['Python', 'JAVA'], ['python', 'java']);
    expect(result.matchedSkills).toEqual(['python', 'java']);
    expect(result.missingSkills).toEqual([]);
  });

  test('returns 0 score for empty job skills', () => {
    const result = computeSkillGap(['python'], []);
    expect(result.score).toBe(0);
  });
});

describe('rankJobsBySkillMatch', () => {
  const jobs = [
    { _id: '1', job_title: 'Python Dev', company: 'A', location: 'NYC', is_remote: false, role_category: 'backend', seniority_level: 'mid', skills: ['python', 'sql', 'django'] },
    { _id: '2', job_title: 'Frontend Dev', company: 'B', location: 'SF', is_remote: true, role_category: 'frontend', seniority_level: 'senior', skills: ['javascript', 'react', 'html', 'css'] },
    { _id: '3', job_title: 'Data Analyst', company: 'C', location: 'Remote', is_remote: true, role_category: 'data', seniority_level: 'entry', skills: ['python', 'sql', 'excel'] },
    { _id: '4', job_title: 'Java Dev', company: 'D', location: 'LA', is_remote: false, role_category: 'backend', seniority_level: 'mid', skills: ['java', 'spring', 'sql'] },
  ];

  test('ranks jobs by skill match score descending', () => {
    const results = rankJobsBySkillMatch(['python', 'sql', 'django'], jobs);
    expect(results[0].job).toBe('Python Dev');
    expect(results[0].score).toBe(100);
  });

  test('limits results to topN', () => {
    const results = rankJobsBySkillMatch(['python', 'sql', 'javascript'], jobs, 2);
    expect(results).toHaveLength(2);
  });

  test('returns all jobs when topN is null', () => {
    const results = rankJobsBySkillMatch(['python'], jobs, null);
    expect(results).toHaveLength(4);
  });

  test('returns jobs with 0 match at the bottom', () => {
    const results = rankJobsBySkillMatch(['kubernetes'], jobs, 10);
    expect(results).toHaveLength(4);
    results.forEach((r) => expect(r.score).toBe(0));
  });

  test('includes correct fields in each result', () => {
    const results = rankJobsBySkillMatch(['python'], jobs, 1);
    const r = results[0];
    expect(r).toHaveProperty('jobId');
    expect(r).toHaveProperty('job');
    expect(r).toHaveProperty('company');
    expect(r).toHaveProperty('location');
    expect(r).toHaveProperty('is_remote');
    expect(r).toHaveProperty('role_category');
    expect(r).toHaveProperty('seniority_level');
    expect(r).toHaveProperty('score');
    expect(r).toHaveProperty('matchedSkills');
    expect(r).toHaveProperty('missingSkills');
  });
});

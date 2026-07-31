import request from './api';

export interface JobMatch {
  title: string;
  company: string;
  score: number;
  requiredSkills: string;
}

export interface RuleRecommendation {
  role: string;
  matchScore: number;
  requiredMissing: string[];
  preferredMissing: string[];
  recommendation: string;
}

export interface SkillCurriculumDetail {
  skill: string;
  prerequisites: string[];
  sub_topics: { name: string; hours: number; resource?: { title: string; url: string } }[];
  total_hours: number;
  difficulty: string;
  practice_projects: { name: string; difficulty: string; description: string }[];
}

export interface AdvancedRecommendation {
  inputSkills: string[];
  extractedSkills: string;
  ruleRecommendations: RuleRecommendation[];
  learningPath: string[];
  learningPathDetails: SkillCurriculumDetail[];
  summary: { total_skills: number; total_hours: number; average_difficulty: string } | null;
  topMatches: JobMatch[];
}

export interface BasicRecommendation {
  inputSkills: string[];
  totalJobsEvaluated: number;
  recommendations: Array<{
    jobId: string;
    job: string;
    company: string;
    location: string;
    is_remote: boolean;
    role_category: string;
    seniority_level: string;
    score: number;
    matchedSkills: string[];
    missingSkills: string[];
  }>;
}

export async function getAdvancedRecommendations(
  skills: string[]
): Promise<AdvancedRecommendation> {
  return request<AdvancedRecommendation>('/recommendations/advanced', {
    method: 'POST',
    body: JSON.stringify({ skills }),
  });
}

export async function getBasicRecommendations(
  skills: string[],
  limit?: number
): Promise<BasicRecommendation> {
  const params = limit ? `?limit=${limit}` : '';
  return request<BasicRecommendation>(`/recommendations${params}`, {
    method: 'POST',
    body: JSON.stringify({ skills }),
  });
}

export async function getMyRecommendations(): Promise<any> {
  return request<any>('/recommendations/me');
}

export async function getSkillGap(jobId: string): Promise<any> {
  return request<any>(`/recommendations/gap/${jobId}`);
}

export interface SkillResources {
  skill: string;
  curriculum: SkillCurriculumDetail | null;
  youtube_videos: { title: string; videoId: string; url: string; author: string; length: number }[];
  books: { title: string; author: string; year: number | null; cover_url: string | null; url: string | null }[];
}

export async function getSkillCurriculum(skill: string): Promise<SkillCurriculumDetail> {
  return request<SkillCurriculumDetail>(`/recommendations/curriculum/${encodeURIComponent(skill)}`);
}

export async function getSkillResources(skill: string): Promise<SkillResources> {
  return request<SkillResources>(`/recommendations/resources/${encodeURIComponent(skill)}`);
}

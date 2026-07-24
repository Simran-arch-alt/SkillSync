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

export interface AdvancedRecommendation {
  inputSkills: string[];
  extractedSkills: string;
  ruleRecommendations: RuleRecommendation[];
  learningPath: string[];
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

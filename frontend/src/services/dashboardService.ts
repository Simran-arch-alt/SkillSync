import request from './api';

export interface TopRecommendation {
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
}

export interface DashboardSummary {
  totalJobs: number;
  remoteJobs: { remote: number; onsite: number };
  categories: { category: string; count: number }[];
  seniority: { seniority: string; count: number }[];
  topSkills: { skill: string; count: number }[];
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const res = await request<{ success: boolean; data: DashboardSummary }>('/dashboard/summary');
  return res.data;
}

export async function getTopRecommendedJobs(): Promise<TopRecommendation[]> {
  const res = await request<{ success: boolean; data: { recommendations: TopRecommendation[] } }>(
    '/dashboard/top-recommended-jobs'
  );
  return res.data.recommendations;
}

export async function getTopSkills(limit = 10): Promise<{ skill: string; count: number }[]> {
  const res = await request<{ success: boolean; data: { topSkills: { skill: string; count: number }[] } }>(
    `/dashboard/top-skills?limit=${limit}`
  );
  return res.data.topSkills;
}

export async function getCategories(): Promise<{ category: string; count: number }[]> {
  const res = await request<{ success: boolean; data: { categories: { category: string; count: number }[] } }>(
    '/dashboard/categories'
  );
  return res.data.categories;
}

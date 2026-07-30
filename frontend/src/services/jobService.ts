import request from './api';

export interface Job {
  _id: string;
  job_title: string;
  company: string;
  location: string;
  is_remote: boolean;
  role_category: string;
  seniority_level: string;
  is_aggregator: boolean;
  skills: string[];
}

export interface JobSearchFilters {
  keyword?: string;
  location?: string;
  remote?: boolean;
  category?: string;
  seniority?: string;
}

export async function getJobs(page = 1, limit = 10, sort?: string): Promise<{ jobs: Job[]; pagination: any }> {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (sort) params.set('sort', sort);
  return request<{ jobs: Job[]; pagination: any }>(`/jobs?${params}`);
}

export async function searchJobs(filters: JobSearchFilters, page = 1, limit = 20): Promise<{ jobs: Job[]; pagination: any }> {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (filters.keyword) params.set('keyword', filters.keyword);
  if (filters.location) params.set('location', filters.location);
  if (filters.remote !== undefined) params.set('remote', String(filters.remote));
  if (filters.category) params.set('category', filters.category);
  if (filters.seniority) params.set('seniority', filters.seniority);
  return request<{ jobs: Job[]; pagination: any }>(`/jobs/search?${params}`);
}

export async function getJobById(id: string): Promise<{ job: Job }> {
  return request<{ job: Job }>(`/jobs/${id}`);
}

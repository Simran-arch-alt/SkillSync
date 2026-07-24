import request from './api';

export interface AdminStats {
  totalUsers: number;
  totalStudents: number;
  totalAdmins: number;
  totalJobs: number;
  remoteJobs: number;
  onsiteJobs: number;
  aggregatorJobs: number;
}

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'suspended';
  university?: string;
  degree?: string;
  skills: string[];
  createdAt: string;
}

export interface AdminJob {
  _id: string;
  job_title: string;
  company: string;
  location: string;
  is_remote: boolean;
  role_category: string;
  seniority_level: string;
  skills: string[];
}

export async function getAdminStats(): Promise<AdminStats> {
  const res = await request<{ users: { total: number; students: number; admins: number }; jobs: { total: number; remote: number; aggregator: number } }>('/admin/stats');
  return {
    totalUsers: res.users.total,
    totalStudents: res.users.students,
    totalAdmins: res.users.admins,
    totalJobs: res.jobs.total,
    remoteJobs: res.jobs.remote,
    onsiteJobs: res.jobs.total - res.jobs.remote,
    aggregatorJobs: res.jobs.aggregator,
  };
}

export async function getAllUsers(page = 1, limit = 50, role?: string): Promise<{ users: AdminUser[]; pagination: any }> {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (role) params.set('role', role);
  const res = await request<{ users: AdminUser[]; pagination: any }>(`/admin/users?${params}`);
  return res;
}

export async function deleteUser(userId: string): Promise<void> {
  return request<void>(`/admin/users/${userId}`, { method: 'DELETE' });
}

export async function updateUserRole(userId: string, role: string): Promise<void> {
  return request<void>(`/admin/users/${userId}/role`, {
    method: 'PUT',
    body: JSON.stringify({ role }),
  });
}

export async function toggleUserStatus(userId: string): Promise<{ user: AdminUser }> {
  return request<{ user: AdminUser }>(`/admin/users/${userId}/status`, {
    method: 'PUT',
  });
}

export async function createJob(job: Partial<AdminJob>): Promise<AdminJob> {
  return request<AdminJob>('/admin/jobs', {
    method: 'POST',
    body: JSON.stringify(job),
  });
}

export async function updateJob(jobId: string, job: Partial<AdminJob>): Promise<AdminJob> {
  return request<AdminJob>(`/admin/jobs/${jobId}`, {
    method: 'PUT',
    body: JSON.stringify(job),
  });
}

export async function deleteJob(jobId: string): Promise<void> {
  return request<void>(`/admin/jobs/${jobId}`, { method: 'DELETE' });
}

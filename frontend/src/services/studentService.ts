import request from './api';

export interface StudentProfile {
  _id: string;
  name: string;
  email: string;
  university?: string;
  degree?: string;
  graduationYear?: number;
  skills: string[];
  role: string;
}

export async function getProfile(): Promise<StudentProfile> {
  return request<StudentProfile>('/students/profile');
}

export async function updateProfile(data: Partial<StudentProfile>): Promise<StudentProfile> {
  return request<StudentProfile>('/students/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export interface SkillsResponse {
  skills: string[];
  resumeSkills: string[];
}

export async function getSkills(): Promise<SkillsResponse> {
  const res = await request<SkillsResponse>('/students/skills');
  return { skills: res.skills || [], resumeSkills: res.resumeSkills || [] };
}

export async function updateSkills(skills: string[]): Promise<string[]> {
  return request<string[]>('/students/skills', {
    method: 'PUT',
    body: JSON.stringify({ skills }),
  });
}

export async function addSkills(skills: string[]): Promise<string[]> {
  return request<string[]>('/students/skills', {
    method: 'POST',
    body: JSON.stringify({ skills }),
  });
}

export async function removeSkills(skills: string[]): Promise<string[]> {
  return request<string[]>('/students/skills', {
    method: 'DELETE',
    body: JSON.stringify({ skills }),
  });
}

export async function uploadResume(file: File): Promise<{ resume: string }> {
  const token = localStorage.getItem('token');
  const formData = new FormData();
  formData.append('resume', file);
  const res = await fetch('/api/students/upload-resume', {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || 'Upload failed');
  }
  return json.data;
}

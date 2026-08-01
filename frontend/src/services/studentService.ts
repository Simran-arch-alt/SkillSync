import request, { apiClient } from './api';

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
  const formData = new FormData();
  formData.append('resume', file);

  try {
    const res = await apiClient.post('/students/upload-resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    if (!res.data.success) {
      throw new Error(res.data.message || 'Upload failed');
    }
    return res.data.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response: { data?: Record<string, unknown> } };
      throw new Error((axiosError.response.data?.message as string) || 'Upload failed');
    }
    throw error;
  }
}

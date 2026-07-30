import request from './api';

export interface LoginData {
  token: string;
  user: {
    _id: string;
    name: string;
    email: string;
    role: string;
    skills: string[];
    university?: string;
    degree?: string;
    graduationYear?: number;
  };
}

export async function login(email: string, password: string): Promise<LoginData> {
  return request<LoginData>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function register(data: {
  name: string;
  email: string;
  password: string;
  university?: string;
  degree?: string;
  graduationYear?: number;
  skills?: string[];
}): Promise<LoginData> {
  return request<LoginData>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getMe(): Promise<LoginData['user']> {
  const res = await request<{ user: LoginData['user'] }>('/auth/me');
  return res.user;
}

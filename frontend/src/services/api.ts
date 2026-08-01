import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';

const API_BASE = '/api';

export const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

interface RequestOptions {
  method?: string;
  body?: string;
  headers?: Record<string, string>;
}

async function request<T>(endpoint: string,options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, headers: customHeaders } = options;
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    ...(customHeaders || {}),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: AxiosRequestConfig = {
    method,
    url: endpoint,
    headers,
    data: body != null ? JSON.parse(body) : undefined,
  };

  try {
    const res = await apiClient.request(config);
    const json = res.data;

    if (!json.success) {
      throw new Error(json.message || `Request failed with status ${res.status}`);
    }

    return json.data as T;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const json = error.response.data as Record<string, unknown>;
      throw new Error(
        (json?.message as string) || `Request failed with status ${error.response.status}`
      );
    }
    throw error;
  }
}

export function uploadFile(endpoint: string, file: File): Promise<any> {
  const formData = new FormData();
  formData.append('file', file);

  return apiClient
    .post(endpoint, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((res) => res.data);
}

export default request;

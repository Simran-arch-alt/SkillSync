import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockRequest = vi.hoisted(() => vi.fn());
const mockPost = vi.hoisted(() => vi.fn());

vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      request: mockRequest,
      post: mockPost,
      interceptors: {
        request: { use: vi.fn() },
      },
    })),
    isAxiosError: vi.fn((err: unknown) => (err as Record<string, unknown>)?.isAxiosError === true),
  },
}));

import request, { uploadFile } from '../../services/api';

beforeEach(() => {
  localStorage.clear();
  mockRequest.mockReset();
  mockPost.mockReset();
});

describe('api request', () => {
  it('makes GET request with correct URL', async () => {
    const mockData = { success: true, data: { total: 5 } };
    mockRequest.mockResolvedValue({ data: mockData, status: 200 });

    const result = await request('/dashboard/total-jobs');
    expect(mockRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        url: '/dashboard/total-jobs',
        method: 'GET',
      })
    );
    expect(result).toEqual({ total: 5 });
  });

  it('includes Authorization header when token exists', async () => {
    localStorage.setItem('token', 'my-jwt-token');
    const mockData = { success: true, data: { user: { name: 'Test' } } };
    mockRequest.mockResolvedValue({ data: mockData, status: 200 });

    await request('/auth/me');
    expect(mockRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        url: '/auth/me',
        method: 'GET',
        headers: expect.objectContaining({
          Authorization: 'Bearer my-jwt-token',
        }),
      })
    );
  });

  it('throws error on non-ok response', async () => {
    const axiosError = Object.assign(new Error('Not found'), {
      isAxiosError: true,
      response: {
        status: 404,
        data: { success: false, message: 'Not found' },
      },
    });
    mockRequest.mockRejectedValue(axiosError);

    await expect(request('/nonexistent')).rejects.toThrow('Not found');
  });

  it('throws generic error when message missing', async () => {
    const axiosError = Object.assign(new Error('Server Error'), {
      isAxiosError: true,
      response: {
        status: 500,
        data: {},
      },
    });
    mockRequest.mockRejectedValue(axiosError);

    await expect(request('/error')).rejects.toThrow('Request failed with status 500');
  });
});

describe('uploadFile', () => {
  it('uploads file with FormData', async () => {
    localStorage.setItem('token', 'upload-token');
    const mockData = { success: true, data: { url: '/uploads/file.pdf' } };
    mockPost.mockResolvedValue({ data: mockData });

    const file = new File(['content'], 'resume.pdf', { type: 'application/pdf' });
    await uploadFile('/students/upload-resume', file);

    expect(mockPost).toHaveBeenCalledWith(
      '/students/upload-resume',
      expect.any(FormData),
      expect.objectContaining({
        headers: expect.objectContaining({
          'Content-Type': 'multipart/form-data',
        }),
      })
    );
  });
});

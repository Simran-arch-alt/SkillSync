import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import request, { uploadFile } from '../../services/api';

beforeEach(() => {
  localStorage.clear();
  vi.spyOn(global, 'fetch');
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('api request', () => {
  test('makes GET request with correct URL', async () => {
    const mockData = { success: true, data: { total: 5 } };
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockData),
    });

    const result = await request('/dashboard/total-jobs');
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/dashboard/total-jobs',
      expect.objectContaining({
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
      })
    );
    expect(result).toEqual({ total: 5 });
  });

  test('includes Authorization header when token exists', async () => {
    localStorage.setItem('token', 'my-jwt-token');
    const mockData = { success: true, data: { user: { name: 'Test' } } };
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockData),
    });

    await request('/auth/me');
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/auth/me',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer my-jwt-token',
        }),
      })
    );
  });

  test('throws error on non-ok response', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ success: false, message: 'Not found' }),
    });

    await expect(request('/nonexistent')).rejects.toThrow('Not found');
  });

  test('throws generic error when message missing', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.resolve({}),
    });

    await expect(request('/error')).rejects.toThrow('Request failed with status 500');
  });
});

describe('uploadFile', () => {
  test('uploads file with FormData', async () => {
    localStorage.setItem('token', 'upload-token');
    const mockData = { success: true, data: { url: '/uploads/file.pdf' } };
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockData),
    });

    const file = new File(['content'], 'resume.pdf', { type: 'application/pdf' });
    const result = await uploadFile('/students/upload-resume', file);

    expect(global.fetch).toHaveBeenCalledWith(
      '/api/students/upload-resume',
      expect.objectContaining({
        method: 'POST',
        headers: { Authorization: 'Bearer upload-token' },
        body: expect.any(FormData),
      })
    );
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockRequest = vi.hoisted(() => vi.fn());

vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      request: mockRequest,
      post: vi.fn(),
      interceptors: {
        request: { use: vi.fn() },
      },
    })),
    isAxiosError: vi.fn((err: unknown) => (err as Record<string, unknown>)?.isAxiosError === true),
  },
}));

import { login, register, getMe } from '../../services/authService';

beforeEach(() => {
  localStorage.clear();
  mockRequest.mockReset();
});

const mockLoginResponse = {
  success: true,
  data: {
    token: 'jwt-token-123',
    user: {
      _id: 'user1',
      name: 'Test User',
      email: 'test@test.com',
      role: 'student',
      skills: ['python'],
    },
  },
};

describe('login', () => {
  it('sends POST request with credentials', async () => {
    mockRequest.mockResolvedValue({
      data: mockLoginResponse,
      status: 200,
    });

    const result = await login('test@test.com', 'password123');
    expect(mockRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        url: '/auth/login',
        method: 'POST',
        data: { email: 'test@test.com', password: 'password123' },
      })
    );
    expect(result.token).toBe('jwt-token-123');
    expect(result.user.email).toBe('test@test.com');
  });

  it('throws on invalid credentials', async () => {
    const axiosError = Object.assign(new Error('Invalid'), {
      isAxiosError: true,
      response: {
        status: 401,
        data: { success: false, message: 'Invalid email or password.' },
      },
    });
    mockRequest.mockRejectedValue(axiosError);

    await expect(login('wrong@test.com', 'bad')).rejects.toThrow('Invalid email or password.');
  });
});

describe('register', () => {
  it('sends POST request with user data', async () => {
    mockRequest.mockResolvedValue({
      data: mockLoginResponse,
      status: 200,
    });

    const result = await register({
      name: 'Test User',
      email: 'test@test.com',
      password: 'password123',
    });
    expect(result.token).toBeDefined();
  });
});

describe('getMe', () => {
  it('fetches current user profile', async () => {
    localStorage.setItem('token', 'jwt-token-123');
    const userData = mockLoginResponse.data.user;
    mockRequest.mockResolvedValue({
      data: { success: true, data: { user: userData } },
      status: 200,
    });

    const result = await getMe();
    expect(mockRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        url: '/auth/me',
        method: 'GET',
        headers: expect.objectContaining({
          Authorization: 'Bearer jwt-token-123',
        }),
      })
    );
    expect(result).toEqual(userData);
  });
});

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { login, register, getMe } from '../../services/authService';

beforeEach(() => {
  localStorage.clear();
  vi.spyOn(global, 'fetch');
});

afterEach(() => {
  vi.restoreAllMocks();
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
  test('sends POST request with credentials', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockLoginResponse),
    });

    const result = await login('test@test.com', 'password123');
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/auth/login',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ email: 'test@test.com', password: 'password123' }),
      })
    );
    expect(result.token).toBe('jwt-token-123');
    expect(result.user.email).toBe('test@test.com');
  });

  test('throws on invalid credentials', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ success: false, message: 'Invalid email or password.' }),
    });

    await expect(login('wrong@test.com', 'bad')).rejects.toThrow('Invalid email or password.');
  });
});

describe('register', () => {
  test('sends POST request with user data', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockLoginResponse),
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
  test('fetches current user profile', async () => {
    localStorage.setItem('token', 'jwt-token-123');
    const userData = mockLoginResponse.data.user;
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true, data: { user: userData } }),
    });

    const result = await getMe();
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/auth/me',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer jwt-token-123',
        }),
      })
    );
    expect(result).toEqual({ user: userData });
  });
});

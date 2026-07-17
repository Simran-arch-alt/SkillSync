import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../services/api', () => ({
  default: vi.fn(),
}));

import request from '../../services/api';
import { getDashboardSummary, getTopSkills, getCategories, getTopRecommendedJobs } from '../../services/dashboardService';

const mockRequest = vi.mocked(request);

beforeEach(() => {
  mockRequest.mockReset();
});

describe('getDashboardSummary', () => {
  test('fetches dashboard summary via /dashboard/summary', async () => {
    const data = {
      totalJobs: 100,
      remoteJobs: { remote: 30, onsite: 70 },
      categories: [{ category: 'backend', count: 40 }],
      seniority: [{ seniority: 'mid', count: 50 }],
      topSkills: [{ skill: 'python', count: 80 }],
    };
    mockRequest.mockResolvedValue(data as any);

    const result = await getDashboardSummary();
    expect(mockRequest).toHaveBeenCalledWith('/dashboard/summary');
    expect(result.totalJobs).toBe(100);
    expect(result.remoteJobs.remote).toBe(30);
    expect(result.topSkills[0].skill).toBe('python');
  });
});

describe('getTopRecommendedJobs', () => {
  test('fetches recommendations via /dashboard/top-recommended-jobs', async () => {
    const recommendations = [
      { jobId: '1', job: 'Python Dev', company: 'A', location: 'NYC', is_remote: false, role_category: 'backend', seniority_level: 'mid', score: 95, matchedSkills: ['python'], missingSkills: [] },
    ];
    mockRequest.mockResolvedValue({ recommendations } as any);

    const result = await getTopRecommendedJobs();
    expect(mockRequest).toHaveBeenCalledWith('/dashboard/top-recommended-jobs');
    expect(result).toHaveLength(1);
    expect(result[0].job).toBe('Python Dev');
  });
});

describe('getTopSkills', () => {
  test('fetches top skills via /dashboard/top-skills', async () => {
    mockRequest.mockResolvedValue({ topSkills: [{ skill: 'python', count: 80 }] } as any);

    const result = await getTopSkills();
    expect(mockRequest).toHaveBeenCalledWith('/dashboard/top-skills?limit=10');
    expect(result[0].skill).toBe('python');
  });

  test('passes custom limit', async () => {
    mockRequest.mockResolvedValue({ topSkills: [] } as any);

    await getTopSkills(5);
    expect(mockRequest).toHaveBeenCalledWith('/dashboard/top-skills?limit=5');
  });
});

describe('getCategories', () => {
  test('fetches categories via /dashboard/categories', async () => {
    mockRequest.mockResolvedValue({ categories: [{ category: 'frontend', count: 20 }] } as any);

    const result = await getCategories();
    expect(mockRequest).toHaveBeenCalledWith('/dashboard/categories');
    expect(result[0].category).toBe('frontend');
  });
});

const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const express = require('express');

let mongoServer;
let app;

const Job = require('../../models/Job');

beforeAll(async () => {
  process.env.JWT_SECRET = 'test-secret-key';
  process.env.JWT_EXPIRE = '1h';
  process.env.NODE_ENV = 'test';

  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  app = express();
  app.use(express.json());

  const dashboardRoutes = require('../../routes/dashboardRoutes');
  const { errorHandler } = require('../../middleware/errorHandler');
  app.use('/api/dashboard', dashboardRoutes);
  app.use(errorHandler);
}, 60000);

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Job.deleteMany({});
});

const seedJobs = async () => {
  return Job.insertMany([
    { job_title: 'Python Dev', company: 'A', location: 'NYC', is_remote: false, role_category: 'backend', seniority_level: 'mid', skills: ['python', 'sql'] },
    { job_title: 'React Dev', company: 'B', location: 'SF', is_remote: true, role_category: 'frontend', seniority_level: 'senior', skills: ['javascript', 'react'] },
    { job_title: 'Data Analyst', company: 'C', location: 'Remote', is_remote: true, role_category: 'data', seniority_level: 'entry', skills: ['python', 'sql', 'excel'] },
  ]);
};

describe('GET /api/dashboard/summary', () => {
  test('returns dashboard summary', async () => {
    await seedJobs();
    const res = await request(app)
      .get('/api/dashboard/summary')
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.totalJobs).toBe(3);
    expect(res.body.data.remoteJobs.remote).toBe(2);
    expect(res.body.data.remoteJobs.onsite).toBe(1);
    expect(res.body.data.categories).toBeInstanceOf(Array);
    expect(res.body.data.topSkills).toBeInstanceOf(Array);
  });
});

describe('GET /api/dashboard/total-jobs', () => {
  test('returns total job count', async () => {
    await seedJobs();
    const res = await request(app)
      .get('/api/dashboard/total-jobs')
      .expect(200);

    expect(res.body.data.total).toBe(3);
  });

  test('returns 0 when no jobs', async () => {
    const res = await request(app)
      .get('/api/dashboard/total-jobs')
      .expect(200);

    expect(res.body.data.total).toBe(0);
  });
});

describe('GET /api/dashboard/remote-jobs', () => {
  test('returns remote vs onsite counts', async () => {
    await seedJobs();
    const res = await request(app)
      .get('/api/dashboard/remote-jobs')
      .expect(200);

    expect(res.body.data.remote).toBe(2);
    expect(res.body.data.onsite).toBe(1);
    expect(res.body.data.total).toBe(3);
  });
});

describe('GET /api/dashboard/categories', () => {
  test('returns category counts', async () => {
    await seedJobs();
    const res = await request(app)
      .get('/api/dashboard/categories')
      .expect(200);

    expect(res.body.data.categories).toHaveLength(3);
    expect(res.body.data.categories[0]).toHaveProperty('category');
    expect(res.body.data.categories[0]).toHaveProperty('count');
  });
});

describe('GET /api/dashboard/top-skills', () => {
  test('returns most common skills', async () => {
    await seedJobs();
    const res = await request(app)
      .get('/api/dashboard/top-skills')
      .expect(200);

    expect(res.body.data.topSkills).toBeInstanceOf(Array);
    expect(res.body.data.topSkills.length).toBeGreaterThan(0);
    expect(res.body.data.topSkills[0]).toHaveProperty('skill');
    expect(res.body.data.topSkills[0]).toHaveProperty('count');
  });

  test('respects limit parameter', async () => {
    await seedJobs();
    const res = await request(app)
      .get('/api/dashboard/top-skills?limit=2')
      .expect(200);

    expect(res.body.data.topSkills.length).toBeLessThanOrEqual(2);
  });
});

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

  const jobRoutes = require('../../routes/jobRoutes');
  const { errorHandler } = require('../../middleware/errorHandler');
  app.use('/api/jobs', jobRoutes);
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
  const jobs = [
    { job_title: 'Python Developer', company: 'TechCo', location: 'NYC', is_remote: false, role_category: 'backend', seniority_level: 'mid', skills: ['python', 'sql', 'django'] },
    { job_title: 'React Developer', company: 'WebCo', location: 'SF', is_remote: true, role_category: 'frontend', seniority_level: 'senior', skills: ['javascript', 'react', 'html', 'css'] },
    { job_title: 'Data Scientist', company: 'DataCo', location: 'Remote', is_remote: true, role_category: 'data', seniority_level: 'entry', skills: ['python', 'tensorflow', 'ml'] },
    { job_title: 'Java Developer', company: 'EnterpriseCo', location: 'LA', is_remote: false, role_category: 'backend', seniority_level: 'mid', skills: ['java', 'spring', 'sql'] },
  ];
  return Job.insertMany(jobs);
};

describe('GET /api/jobs', () => {
  test('returns paginated jobs', async () => {
    await seedJobs();
    const res = await request(app)
      .get('/api/jobs')
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.jobs).toHaveLength(4);
    expect(res.body.data.pagination.total).toBe(4);
  });

  test('handles pagination params', async () => {
    await seedJobs();
    const res = await request(app)
      .get('/api/jobs?page=1&limit=2')
      .expect(200);

    expect(res.body.data.jobs).toHaveLength(2);
    expect(res.body.data.pagination.totalPages).toBe(2);
  });

  test('returns empty array when no jobs', async () => {
    const res = await request(app)
      .get('/api/jobs')
      .expect(200);

    expect(res.body.data.jobs).toHaveLength(0);
  });
});

describe('GET /api/jobs/:id', () => {
  test('returns a job by ID', async () => {
    const [job] = await seedJobs();
    const res = await request(app)
      .get(`/api/jobs/${job._id}`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.job.job_title).toBe('Python Developer');
  });

  test('returns 404 for non-existent job', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    await request(app)
      .get(`/api/jobs/${fakeId}`)
      .expect(404);
  });

  test('returns 400 for invalid ObjectId', async () => {
    await request(app)
      .get('/api/jobs/invalid-id')
      .expect(400);
  });
});

describe('GET /api/jobs/search', () => {
  beforeEach(async () => {
    await seedJobs();
  });

  test('searches by keyword in title', async () => {
    const res = await request(app)
      .get('/api/jobs/search?keyword=python')
      .expect(200);

    expect(res.body.data.jobs.length).toBeGreaterThanOrEqual(1);
    expect(res.body.data.jobs[0].job_title).toMatch(/python/i);
  });

  test('filters by remote status', async () => {
    const res = await request(app)
      .get('/api/jobs/search?remote=true')
      .expect(200);

    expect(res.body.data.jobs).toHaveLength(2);
    res.body.data.jobs.forEach((job) => {
      expect(job.is_remote).toBe(true);
    });
  });

  test('filters by category', async () => {
    const res = await request(app)
      .get('/api/jobs/search?category=frontend')
      .expect(200);

    expect(res.body.data.jobs).toHaveLength(1);
    expect(res.body.data.jobs[0].role_category).toBe('frontend');
  });

  test('searches by keyword in skills', async () => {
    const res = await request(app)
      .get('/api/jobs/search?keyword=tensorflow')
      .expect(200);

    expect(res.body.data.jobs).toHaveLength(1);
    expect(res.body.data.jobs[0].job_title).toBe('Data Scientist');
  });
});

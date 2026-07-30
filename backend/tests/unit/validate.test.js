const {
  validateRegister,
  validateLogin,
  validateObjectId,
  validateJobCreate,
  validateJobUpdate,
  validateRoleUpdate,
  validateSkillsArray,
} = require('../../middleware/validate');

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const callMiddleware = (middleware, req) => {
  return new Promise((resolve, reject) => {
    const res = mockRes();
    middleware(req, res, (err) => {
      if (err) resolve({ err, res });
      else resolve({ err: null, res });
    });
  });
};

describe('validateRegister', () => {
  const validBody = {
    name: 'John',
    email: 'john@test.com',
    password: 'password123',
  };

  test('passes with valid body', async () => {
    const { err } = await callMiddleware(validateRegister, { body: validBody });
    expect(err).toBeFalsy();
  });

  test('rejects missing name', async () => {
    const { err } = await callMiddleware(validateRegister, { body: { ...validBody, name: '' } });
    expect(err).toBeInstanceOf(Error);
    expect(err.statusCode).toBe(400);
  });

  test('rejects short name', async () => {
    const { err } = await callMiddleware(validateRegister, { body: { ...validBody, name: 'A' } });
    expect(err).toBeDefined();
  });

  test('rejects invalid email', async () => {
    const { err } = await callMiddleware(validateRegister, { body: { ...validBody, email: 'notemail' } });
    expect(err).toBeDefined();
  });

  test('rejects short password', async () => {
    const { err } = await callMiddleware(validateRegister, { body: { ...validBody, password: '123' } });
    expect(err).toBeDefined();
  });

  test('rejects invalid graduation year', async () => {
    const { err } = await callMiddleware(validateRegister, { body: { ...validBody, graduationYear: 3000 } });
    expect(err).toBeDefined();
  });

  test('rejects non-array skills', async () => {
    const { err } = await callMiddleware(validateRegister, { body: { ...validBody, skills: 'python' } });
    expect(err).toBeDefined();
  });

  test('passes with valid skills array', async () => {
    const { err } = await callMiddleware(validateRegister, { body: { ...validBody, skills: ['python', 'java'] } });
    expect(err).toBeFalsy();
  });
});

describe('validateLogin', () => {
  test('passes with valid credentials', async () => {
    const { err } = await callMiddleware(validateLogin, { body: { email: 'a@b.com', password: 'pass123' } });
    expect(err).toBeFalsy();
  });

  test('rejects invalid email', async () => {
    const { err } = await callMiddleware(validateLogin, { body: { email: 'bad', password: 'pass123' } });
    expect(err).toBeDefined();
  });

  test('rejects missing password', async () => {
    const { err } = await callMiddleware(validateLogin, { body: { email: 'a@b.com' } });
    expect(err).toBeDefined();
  });
});

describe('validateObjectId', () => {
  test('passes with valid ObjectId', async () => {
    const middleware = validateObjectId('id');
    const { err } = await callMiddleware(middleware, { params: { id: '507f1f77bcf86cd799439011' } });
    expect(err).toBeFalsy();
  });

  test('rejects invalid ObjectId', async () => {
    const middleware = validateObjectId('id');
    const { err } = await callMiddleware(middleware, { params: { id: 'not-a-valid-id' } });
    expect(err).toBeDefined();
    expect(err.statusCode).toBe(400);
  });
});

describe('validateJobCreate', () => {
  test('passes with valid job body', async () => {
    const { err } = await callMiddleware(validateJobCreate, { body: { job_title: 'Engineer', skills: ['python'] } });
    expect(err).toBeFalsy();
  });

  test('rejects missing job_title', async () => {
    const { err } = await callMiddleware(validateJobCreate, { body: {} });
    expect(err).toBeDefined();
  });

  test('rejects non-boolean is_remote', async () => {
    const { err } = await callMiddleware(validateJobCreate, { body: { job_title: 'Dev', is_remote: 'yes' } });
    expect(err).toBeDefined();
  });

  test('rejects non-array skills', async () => {
    const { err } = await callMiddleware(validateJobCreate, { body: { job_title: 'Dev', skills: 'python' } });
    expect(err).toBeDefined();
  });
});

describe('validateRoleUpdate', () => {
  test('passes with valid role', async () => {
    const { err } = await callMiddleware(validateRoleUpdate, { body: { role: 'admin' } });
    expect(err).toBeFalsy();
  });

  test('rejects invalid role', async () => {
    const { err } = await callMiddleware(validateRoleUpdate, { body: { role: 'superadmin' } });
    expect(err).toBeDefined();
  });

  test('rejects missing role', async () => {
    const { err } = await callMiddleware(validateRoleUpdate, { body: {} });
    expect(err).toBeDefined();
  });
});

describe('validateSkillsArray', () => {
  test('passes with valid array', async () => {
    const { err } = await callMiddleware(validateSkillsArray, { body: { skills: ['python'] } });
    expect(err).toBeFalsy();
  });

  test('rejects empty array', async () => {
    const { err } = await callMiddleware(validateSkillsArray, { body: { skills: [] } });
    expect(err).toBeDefined();
  });

  test('rejects non-array', async () => {
    const { err } = await callMiddleware(validateSkillsArray, { body: { skills: 'python' } });
    expect(err).toBeDefined();
  });
});

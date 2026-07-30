const { errorHandler, notFoundHandler } = require('../../middleware/errorHandler');
const AppError = require('../../utils/AppError');

const mockReq = (url = '/test') => ({
  originalUrl: url,
  method: 'GET',
  headers: {},
});

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
});

describe('notFoundHandler', () => {
  test('calls next with 404 AppError', () => {
    notFoundHandler(mockReq('/api/missing'), mockRes(), mockNext);
    expect(mockNext).toHaveBeenCalledTimes(1);
    const error = mockNext.mock.calls[0][0];
    expect(error).toBeInstanceOf(AppError);
    expect(error.statusCode).toBe(404);
    expect(error.message).toContain('/api/missing');
  });
});

describe('errorHandler', () => {
  test('handles AppError with custom status', () => {
    const res = mockRes();
    const err = new AppError('Custom error', 422);
    errorHandler(err, mockReq(), res, mockNext);
    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: 'Custom error',
      })
    );
  });

  test('handles generic Error', () => {
    const res = mockRes();
    const err = new Error('Something broke');
    errorHandler(err, mockReq(), res, mockNext);
    expect(res.status).toHaveBeenCalled();
    const status = res.status.mock.calls[0][0];
    expect(status).toBeGreaterThanOrEqual(400);
  });

  test('handles CastError (invalid ObjectId)', () => {
    const res = mockRes();
    const err = new Error('Cast to ObjectId failed');
    err.name = 'CastError';
    err.path = '_id';
    err.value = 'invalid';
    errorHandler(err, mockReq(), res, mockNext);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('handles duplicate key error (code 11000)', () => {
    const res = mockRes();
    const err = new Error('duplicate key');
    err.code = 11000;
    err.keyValue = { email: 'test@test.com' };
    errorHandler(err, mockReq(), res, mockNext);
    expect(res.status).toHaveBeenCalledWith(409);
  });

  test('handles ValidationError', () => {
    const res = mockRes();
    const err = new Error('Validation failed');
    err.name = 'ValidationError';
    err.errors = { name: { message: 'Name is required' } };
    errorHandler(err, mockReq(), res, mockNext);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('handles JsonWebTokenError', () => {
    const res = mockRes();
    const err = new Error('jwt malformed');
    err.name = 'JsonWebTokenError';
    errorHandler(err, mockReq(), res, mockNext);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  test('handles TokenExpiredError', () => {
    const res = mockRes();
    const err = new Error('jwt expired');
    err.name = 'TokenExpiredError';
    errorHandler(err, mockReq(), res, mockNext);
    expect(res.status).toHaveBeenCalledWith(401);
  });
});

const { sendSuccess, sendError } = require('../../utils/apiResponse');

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('sendSuccess', () => {
  test('sends correct status and response', () => {
    const res = mockRes();
    sendSuccess(res, 200, 'OK', { foo: 'bar' });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'OK',
      data: { foo: 'bar' },
    });
  });

  test('uses default values when not provided', () => {
    const res = mockRes();
    sendSuccess(res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Success',
      data: {},
    });
  });
});

describe('sendError', () => {
  test('sends correct status and error response', () => {
    const res = mockRes();
    sendError(res, 404, 'Not found', { detail: 'nope' });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Not found',
      error: { detail: 'nope' },
    });
  });

  test('uses default values when not provided', () => {
    const res = mockRes();
    sendError(res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Something went wrong',
      error: {},
    });
  });
});

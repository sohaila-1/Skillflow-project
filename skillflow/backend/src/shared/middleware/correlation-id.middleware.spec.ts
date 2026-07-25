import { CorrelationIdMiddleware, CORRELATION_ID_HEADER } from './correlation-id.middleware';
import { Request, Response } from 'express';

function makeReq(headers: Record<string, string> = {}): Request {
  return { headers } as unknown as Request;
}

function makeRes(): { res: Response; setHeader: jest.Mock } {
  const setHeader = jest.fn();
  const res = { setHeader } as unknown as Response;
  return { res, setHeader };
}

describe('CorrelationIdMiddleware', () => {
  let middleware: CorrelationIdMiddleware;
  const next = jest.fn();

  beforeEach(() => {
    middleware = new CorrelationIdMiddleware();
    next.mockClear();
  });

  it('forwards an existing x-correlation-id from the request', () => {
    const req = makeReq({ [CORRELATION_ID_HEADER]: 'existing-id-123' });
    const { res, setHeader } = makeRes();

    middleware.use(req, res, next);

    expect(req.headers[CORRELATION_ID_HEADER]).toBe('existing-id-123');
    expect(setHeader).toHaveBeenCalledWith(CORRELATION_ID_HEADER, 'existing-id-123');
    expect(next).toHaveBeenCalled();
  });

  it('generates a UUID when no x-correlation-id is present', () => {
    const req = makeReq();
    const { res, setHeader } = makeRes();

    middleware.use(req, res, next);

    const assigned = req.headers[CORRELATION_ID_HEADER] as string;
    expect(assigned).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
    expect(setHeader).toHaveBeenCalledWith(CORRELATION_ID_HEADER, assigned);
    expect(next).toHaveBeenCalled();
  });

  it('always calls next()', () => {
    const req = makeReq();
    const { res } = makeRes();

    middleware.use(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});

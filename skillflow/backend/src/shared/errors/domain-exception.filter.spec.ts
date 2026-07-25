import { DomainExceptionFilter } from './domain-exception.filter';
import {
  NotFoundError,
  UnauthorizedError,
  ValidationError,
  ConflictError,
  DomainError,
} from './domain.error';
import { ArgumentsHost, HttpStatus } from '@nestjs/common';

function makeHost(status: jest.Mock, json: jest.Mock): ArgumentsHost {
  return {
    switchToHttp: () => ({
      getResponse: () => ({
        status: (code: number) => ({ json }),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any),
    }),
  } as unknown as ArgumentsHost;
}

describe('DomainExceptionFilter', () => {
  let filter: DomainExceptionFilter;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    filter = new DomainExceptionFilter();
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
  });

  function makeHost2(): ArgumentsHost {
    return {
      switchToHttp: () => ({
        getResponse: () => ({ status: statusMock }),
      }),
    } as unknown as ArgumentsHost;
  }

  it('maps NotFoundError to 404', () => {
    filter.catch(new NotFoundError('Course', 'uuid-1'), makeHost2());
    expect(statusMock).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ error: 'NOT_FOUND' }));
  });

  it('maps UnauthorizedError to 401', () => {
    filter.catch(new UnauthorizedError(), makeHost2());
    expect(statusMock).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
  });

  it('maps ValidationError to 400', () => {
    filter.catch(new ValidationError('invalid input'), makeHost2());
    expect(statusMock).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
  });

  it('maps ConflictError to 409', () => {
    filter.catch(new ConflictError('already exists'), makeHost2());
    expect(statusMock).toHaveBeenCalledWith(HttpStatus.CONFLICT);
  });

  it('maps unknown DomainError to 500', () => {
    class CustomDomainError extends DomainError {
      constructor() { super('CUSTOM', 'custom error'); }
    }
    filter.catch(new CustomDomainError(), makeHost2());
    expect(statusMock).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
  });

  it('includes timestamp in the response body', () => {
    filter.catch(new NotFoundError('User', 'u-1'), makeHost2());
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({ timestamp: expect.any(String) }),
    );
  });
});

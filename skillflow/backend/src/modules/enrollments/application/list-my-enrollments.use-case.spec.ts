import { ListMyEnrollmentsUseCase } from './list-my-enrollments.use-case';
import { EnrollmentRepositoryPort } from '../domain/enrollment.repository.port';
import { Enrollment } from '../domain/enrollment.entity';
import { ok, err } from 'neverthrow';
import { ValidationError } from '@shared/errors/domain.error';

const mockRepo: jest.Mocked<EnrollmentRepositoryPort> = {
  findByUser: jest.fn(),
  findByUserAndCourse: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
};

describe('ListMyEnrollmentsUseCase', () => {
  let useCase: ListMyEnrollmentsUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new ListMyEnrollmentsUseCase(mockRepo);
  });

  it('returns all enrollments for the given user', async () => {
    const enrollments = [
      Object.assign(new Enrollment(), { id: 'e1', userId: 'user-1', courseId: 'course-a' }),
      Object.assign(new Enrollment(), { id: 'e2', userId: 'user-1', courseId: 'course-b' }),
    ];
    mockRepo.findByUser.mockResolvedValue(ok(enrollments));

    const result = await useCase.execute('user-1');

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).toHaveLength(2);
      expect(result.value[0].courseId).toBe('course-a');
    }
    expect(mockRepo.findByUser).toHaveBeenCalledWith('user-1');
  });

  it('returns empty array when user has no enrollments', async () => {
    mockRepo.findByUser.mockResolvedValue(ok([]));

    const result = await useCase.execute('user-1');

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).toHaveLength(0);
    }
  });

  it('propagates repository errors', async () => {
    mockRepo.findByUser.mockResolvedValue(err(new ValidationError('db error')));

    const result = await useCase.execute('user-1');

    expect(result.isErr()).toBe(true);
  });
});

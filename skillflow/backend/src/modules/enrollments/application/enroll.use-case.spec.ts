import { EnrollUseCase } from './enroll.use-case';
import { EnrollmentRepositoryPort } from '../domain/enrollment.repository.port';
import { Enrollment } from '../domain/enrollment.entity';
import { ok } from 'neverthrow';
import { ConflictError } from '@shared/errors/domain.error';

const mockRepo: jest.Mocked<EnrollmentRepositoryPort> = {
  findByUser: jest.fn(),
  findByUserAndCourse: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
};

describe('EnrollUseCase', () => {
  let useCase: EnrollUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new EnrollUseCase(mockRepo);
  });

  it('creates an enrollment when the user is not already enrolled', async () => {
    mockRepo.findByUserAndCourse.mockResolvedValue(null);
    const saved = Object.assign(new Enrollment(), {
      id: 'enroll-uuid',
      userId: 'user-1',
      courseId: 'course-1',
    });
    mockRepo.save.mockResolvedValue(ok(saved));

    const result = await useCase.execute('user-1', 'course-1');

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.userId).toBe('user-1');
      expect(result.value.courseId).toBe('course-1');
    }
    expect(mockRepo.save).toHaveBeenCalledWith(
      expect.objectContaining({ userId: 'user-1', courseId: 'course-1' }),
    );
  });

  it('returns ConflictError when already enrolled', async () => {
    const existing = Object.assign(new Enrollment(), {
      id: 'enroll-uuid',
      userId: 'user-1',
      courseId: 'course-1',
    });
    mockRepo.findByUserAndCourse.mockResolvedValue(existing);

    const result = await useCase.execute('user-1', 'course-1');

    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toBeInstanceOf(ConflictError);
      expect(result.error.code).toBe('CONFLICT');
    }
    expect(mockRepo.save).not.toHaveBeenCalled();
  });

  it('propagates repository save errors', async () => {
    const { err } = await import('neverthrow');
    const { ValidationError } = await import('@shared/errors/domain.error');
    mockRepo.findByUserAndCourse.mockResolvedValue(null);
    mockRepo.save.mockResolvedValue(err(new ValidationError('save failed')));

    const result = await useCase.execute('user-1', 'course-1');

    expect(result.isErr()).toBe(true);
  });
});

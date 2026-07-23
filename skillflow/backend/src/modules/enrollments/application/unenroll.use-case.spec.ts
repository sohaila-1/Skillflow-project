import { UnenrollUseCase } from './unenroll.use-case';
import { EnrollmentRepositoryPort } from '../domain/enrollment.repository.port';
import { Enrollment } from '../domain/enrollment.entity';
import { ok } from 'neverthrow';
import { NotFoundError } from '@shared/errors/domain.error';

const mockRepo: jest.Mocked<EnrollmentRepositoryPort> = {
  findByUser: jest.fn(),
  findByUserAndCourse: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
};

describe('UnenrollUseCase', () => {
  let useCase: UnenrollUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new UnenrollUseCase(mockRepo);
  });

  it('deletes the enrollment when it exists', async () => {
    const existing = Object.assign(new Enrollment(), {
      id: 'enroll-uuid',
      userId: 'user-1',
      courseId: 'course-1',
    });
    mockRepo.findByUserAndCourse.mockResolvedValue(existing);
    mockRepo.delete.mockResolvedValue(ok(undefined));

    const result = await useCase.execute('user-1', 'course-1');

    expect(result.isOk()).toBe(true);
    expect(mockRepo.delete).toHaveBeenCalledWith('user-1', 'course-1');
  });

  it('returns NotFoundError when enrollment does not exist', async () => {
    mockRepo.findByUserAndCourse.mockResolvedValue(null);

    const result = await useCase.execute('user-1', 'course-xyz');

    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toBeInstanceOf(NotFoundError);
      expect(result.error.code).toBe('NOT_FOUND');
    }
    expect(mockRepo.delete).not.toHaveBeenCalled();
  });
});

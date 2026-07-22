import { DeleteCourseUseCase } from './delete-course.use-case';
import { CourseRepositoryPort } from '../domain/course.repository.port';
import { Course } from '../domain/course.entity';
import { ok, err } from 'neverthrow';
import { NotFoundError, UnauthorizedError } from '@shared/errors/domain.error';

const mockRepo: jest.Mocked<CourseRepositoryPort> = {
  findById: jest.fn(),
  findAll: jest.fn(),
  findByInstructor: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
};

const makeCourse = (overrides: Partial<Course> = {}): Course =>
  Object.assign(new Course(), {
    id: 'course-1',
    title: 'Test Course',
    description: 'A test',
    instructorId: 'instructor-1',
    category: 'General',
    level: 'Beginner',
    sections: [],
    published: false,
    ...overrides,
  });

describe('DeleteCourseUseCase', () => {
  let useCase: DeleteCourseUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new DeleteCourseUseCase(mockRepo);
  });

  it('deletes when requester is instructor', async () => {
    const course = makeCourse();
    mockRepo.findById.mockResolvedValue(ok(course));
    mockRepo.delete.mockResolvedValue(ok(undefined));

    const result = await useCase.execute('course-1', 'instructor-1');

    expect(result.isOk()).toBe(true);
    expect(mockRepo.delete).toHaveBeenCalledWith('course-1');
  });

  it('returns UnauthorizedError when different user tries to delete', async () => {
    const course = makeCourse();
    mockRepo.findById.mockResolvedValue(ok(course));

    const result = await useCase.execute('course-1', 'different-user');

    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toBeInstanceOf(UnauthorizedError);
      expect(result.error.code).toBe('UNAUTHORIZED');
    }
    expect(mockRepo.delete).not.toHaveBeenCalled();
  });

  it('propagates repo error when course not found', async () => {
    mockRepo.findById.mockResolvedValue(err(new NotFoundError('Course', 'course-1')));

    const result = await useCase.execute('course-1', 'instructor-1');

    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toBeInstanceOf(NotFoundError);
      expect(result.error.code).toBe('NOT_FOUND');
    }
    expect(mockRepo.delete).not.toHaveBeenCalled();
  });
});

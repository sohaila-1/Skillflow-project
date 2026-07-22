import { GetCourseUseCase } from './get-course.use-case';
import { CourseRepositoryPort } from '../domain/course.repository.port';
import { Course } from '../domain/course.entity';
import { ok, err } from 'neverthrow';
import { NotFoundError } from '@shared/errors/domain.error';

const mockRepo: jest.Mocked<CourseRepositoryPort> = {
  findById: jest.fn(),
  findAll: jest.fn(),
  findByInstructor: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
};

describe('GetCourseUseCase', () => {
  let useCase: GetCourseUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new GetCourseUseCase(mockRepo);
  });

  it('returns the course when found', async () => {
    const course = Object.assign(new Course(), {
      id: 'uuid-1',
      title: 'Test Course',
      description: 'A test',
      instructorId: 'i-1',
      category: 'General',
      level: 'Beginner',
      sections: [],
      published: false,
    });
    mockRepo.findById.mockResolvedValue(ok(course));

    const result = await useCase.execute('uuid-1');

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.id).toBe('uuid-1');
      expect(result.value.title).toBe('Test Course');
    }
    expect(mockRepo.findById).toHaveBeenCalledWith('uuid-1');
  });

  it('propagates NotFoundError when repo returns error', async () => {
    mockRepo.findById.mockResolvedValue(err(new NotFoundError('Course', 'uuid-99')));

    const result = await useCase.execute('uuid-99');

    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toBeInstanceOf(NotFoundError);
      expect(result.error.code).toBe('NOT_FOUND');
    }
  });
});

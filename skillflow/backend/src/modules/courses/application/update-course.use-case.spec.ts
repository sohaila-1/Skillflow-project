import { UpdateCourseUseCase } from './update-course.use-case';
import { CourseRepositoryPort } from '../domain/course.repository.port';
import { Course } from '../domain/course.entity';
import { ok, err } from 'neverthrow';
import { NotFoundError, UnauthorizedError } from '@shared/errors/domain.error';
import { UpdateCourseDto } from '../presentation/dto/update-course.dto';

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
    title: 'Original Title',
    description: 'Original Description',
    instructorId: 'instructor-1',
    category: 'General',
    level: 'Beginner',
    sections: [],
    published: false,
    ...overrides,
  });

describe('UpdateCourseUseCase', () => {
  let useCase: UpdateCourseUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new UpdateCourseUseCase(mockRepo);
  });

  it('updates allowed fields when requester is the instructor', async () => {
    const course = makeCourse();
    mockRepo.findById.mockResolvedValue(ok(course));
    mockRepo.save.mockImplementation(async (c) => ok(c));

    const dto: UpdateCourseDto = { title: 'New Title' };
    const result = await useCase.execute('course-1', dto, 'instructor-1');

    expect(result.isOk()).toBe(true);
    expect(mockRepo.save).toHaveBeenCalled();
    const savedCourse = mockRepo.save.mock.calls[0][0] as Course;
    expect(savedCourse.title).toBe('New Title');
    expect(savedCourse.description).toBe('Original Description');
  });

  it('returns UnauthorizedError when a different user tries to update', async () => {
    const course = makeCourse();
    mockRepo.findById.mockResolvedValue(ok(course));

    const dto: UpdateCourseDto = { title: 'Hacked Title' };
    const result = await useCase.execute('course-1', dto, 'different-user');

    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toBeInstanceOf(UnauthorizedError);
      expect(result.error.code).toBe('UNAUTHORIZED');
    }
    expect(mockRepo.save).not.toHaveBeenCalled();
  });

  it('propagates repo error when course not found', async () => {
    mockRepo.findById.mockResolvedValue(err(new NotFoundError('Course', 'course-1')));

    const dto: UpdateCourseDto = { title: 'New Title' };
    const result = await useCase.execute('course-1', dto, 'instructor-1');

    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toBeInstanceOf(NotFoundError);
    }
    expect(mockRepo.save).not.toHaveBeenCalled();
  });
});

import { ListCoursesUseCase } from './list-courses.use-case';
import { CourseRepositoryPort } from '../domain/course.repository.port';
import { Course } from '../domain/course.entity';
import { ok, err } from 'neverthrow';
import { ValidationError } from '@shared/errors/domain.error';

const mockRepo: jest.Mocked<CourseRepositoryPort> = {
  findById: jest.fn(),
  findAll: jest.fn(),
  findByInstructor: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
};

describe('ListCoursesUseCase', () => {
  let useCase: ListCoursesUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new ListCoursesUseCase(mockRepo);
  });

  it('returns all courses from the repository', async () => {
    const courses = [
      Object.assign(new Course(), { id: 'c1', title: 'Python' }),
      Object.assign(new Course(), { id: 'c2', title: 'TypeScript' }),
    ];
    mockRepo.findAll.mockResolvedValue(ok(courses));

    const result = await useCase.execute();

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).toHaveLength(2);
      expect(result.value[0].title).toBe('Python');
    }
  });

  it('returns empty array when no courses exist', async () => {
    mockRepo.findAll.mockResolvedValue(ok([]));

    const result = await useCase.execute();

    expect(result.isOk()).toBe(true);
    if (result.isOk()) expect(result.value).toHaveLength(0);
  });

  it('propagates repository errors', async () => {
    mockRepo.findAll.mockResolvedValue(err(new ValidationError('db error')));

    const result = await useCase.execute();

    expect(result.isErr()).toBe(true);
  });
});

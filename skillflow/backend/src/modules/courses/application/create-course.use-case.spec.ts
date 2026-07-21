import { CreateCourseUseCase } from './create-course.use-case';
import { CourseRepositoryPort } from '../domain/course.repository.port';
import { Course } from '../domain/course.entity';
import { ok } from 'neverthrow';
import { CreateCourseDto } from '../presentation/dto/create-course.dto';

const mockRepo: jest.Mocked<CourseRepositoryPort> = {
  findById: jest.fn(),
  findAll: jest.fn(),
  findByInstructor: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
};

describe('CreateCourseUseCase', () => {
  let useCase: CreateCourseUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new CreateCourseUseCase(mockRepo);
  });

  it('creates a course with correct fields', async () => {
    const saved = Object.assign(new Course(), {
      id: 'uuid-1',
      title: 'Intro to TypeScript',
      description: 'Learn TS basics',
      instructorId: 'instructor-1',
      category: 'Programming',
      level: 'Beginner',
      sections: [],
      published: false,
    });
    mockRepo.save.mockResolvedValue(ok(saved));

    const dto: CreateCourseDto = {
      title: 'Intro to TypeScript',
      description: 'Learn TS basics',
      category: 'Programming',
      level: 'Beginner',
      sections: [],
      published: false,
    };

    const result = await useCase.execute(dto, 'instructor-1');

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.title).toBe('Intro to TypeScript');
      expect(result.value.instructorId).toBe('instructor-1');
    }
  });

  it('applies defaults for category and level when not provided', async () => {
    const saved = Object.assign(new Course(), {
      id: 'uuid-2',
      title: 'Test',
      description: 'Desc',
      instructorId: 'i-1',
      category: 'General',
      level: 'Beginner',
      sections: [],
      published: false,
    });
    mockRepo.save.mockResolvedValue(ok(saved));

    const dto: CreateCourseDto = { title: 'Test', description: 'Desc', sections: [] };
    const result = await useCase.execute(dto, 'i-1');

    expect(result.isOk()).toBe(true);
    const callArg = mockRepo.save.mock.calls[0][0] as Course;
    expect(callArg.category).toBe('General');
    expect(callArg.level).toBe('Beginner');
  });

  it('propagates repository errors', async () => {
    const { err } = await import('neverthrow');
    const { ValidationError } = await import('@shared/errors/domain.error');
    mockRepo.save.mockResolvedValue(err(new ValidationError('title too long')));

    const dto: CreateCourseDto = { title: 'x'.repeat(300), description: 'Desc', sections: [] };
    const result = await useCase.execute(dto, 'i-1');

    expect(result.isErr()).toBe(true);
  });
});

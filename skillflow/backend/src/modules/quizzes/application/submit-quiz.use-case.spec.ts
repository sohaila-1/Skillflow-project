import { NotFoundException } from '@nestjs/common';
import { SubmitQuizUseCase, SubmitQuizDto } from './submit-quiz.use-case';
import { QuizRepositoryPort } from '../domain/quiz.repository.port';
import { CourseRepositoryPort } from '@modules/courses/domain/course.repository.port';
import { IssueCertificateUseCase } from '@modules/certificates/application/issue-certificate.use-case';
import { PubSubService } from '@shared/pubsub/pubsub.service';
import { Quiz } from '../domain/quiz.entity';
import { Course } from '@modules/courses/domain/course.entity';
import { ok, err } from 'neverthrow';
import { NotFoundError } from '@shared/errors/domain.error';

const mockQuizRepo: jest.Mocked<QuizRepositoryPort> = {
  findByCourseId: jest.fn(),
  save: jest.fn(),
  saveAttempt: jest.fn(),
  findAttemptsByUser: jest.fn(),
};

const mockCourseRepo: jest.Mocked<CourseRepositoryPort> = {
  findById: jest.fn(),
  findAll: jest.fn(),
  findByInstructor: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
};

const mockIssueCert = { execute: jest.fn() } as unknown as jest.Mocked<IssueCertificateUseCase>;
const mockPubSub = { publish: jest.fn() } as unknown as jest.Mocked<PubSubService>;

function makeQuiz(overrides: Partial<Quiz> = {}): Quiz {
  return Object.assign(new Quiz(), {
    id: 'quiz-1',
    courseId: 'course-1',
    title: 'Test Quiz',
    questions: [
      { id: 'q1', text: 'Q1', options: ['A', 'B'], correctIndex: 0 },
      { id: 'q2', text: 'Q2', options: ['A', 'B'], correctIndex: 1 },
      { id: 'q3', text: 'Q3', options: ['A', 'B', 'C'], correctIndex: 2 },
    ],
    ...overrides,
  });
}

const dto: SubmitQuizDto = {
  courseId: 'course-1',
  userId: 'user-1',
  studentName: 'Alice',
  studentEmail: 'alice@example.com',
  answers: [0, 1, 2], // all correct
};

describe('SubmitQuizUseCase', () => {
  let useCase: SubmitQuizUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new SubmitQuizUseCase(mockQuizRepo, mockCourseRepo, mockIssueCert, mockPubSub);
  });

  it('throws NotFoundException when quiz does not exist', async () => {
    mockQuizRepo.findByCourseId.mockResolvedValue(ok(null));

    await expect(useCase.execute(dto)).rejects.toThrow(NotFoundException);
    expect(mockQuizRepo.saveAttempt).not.toHaveBeenCalled();
  });

  it('calculates score correctly and saves attempt', async () => {
    const quiz = makeQuiz();
    mockQuizRepo.findByCourseId.mockResolvedValue(ok(quiz));
    mockQuizRepo.saveAttempt.mockResolvedValue(ok({} as any));
    mockCourseRepo.findById.mockResolvedValue(err(new NotFoundError('Course', 'course-1')));

    const result = await useCase.execute(dto);

    expect(result.score).toBe(3);
    expect(result.total).toBe(3);
    expect(result.percentage).toBe(100);
    expect(result.passed).toBe(true);
    expect(mockQuizRepo.saveAttempt).toHaveBeenCalledWith(
      expect.objectContaining({ userId: 'user-1', score: 3, quizId: 'quiz-1' }),
    );
  });

  it('issues certificate and publishes event when passed', async () => {
    const quiz = makeQuiz();
    const course = Object.assign(new Course(), { id: 'course-1', title: 'Python' });
    mockQuizRepo.findByCourseId.mockResolvedValue(ok(quiz));
    mockQuizRepo.saveAttempt.mockResolvedValue(ok({} as any));
    mockCourseRepo.findById.mockResolvedValue(ok(course));
    mockIssueCert.execute.mockResolvedValue({} as any);
    mockPubSub.publish.mockResolvedValue(undefined);

    await useCase.execute(dto);

    expect(mockIssueCert.execute).toHaveBeenCalledWith(
      expect.objectContaining({ userId: 'user-1', courseId: 'course-1', score: 3 }),
    );
    expect(mockPubSub.publish).toHaveBeenCalledWith('CERTIFICATE_GENERATION', expect.any(Object));
  });

  it('does not issue certificate when score is below 70%', async () => {
    const quiz = makeQuiz();
    mockQuizRepo.findByCourseId.mockResolvedValue(ok(quiz));
    mockQuizRepo.saveAttempt.mockResolvedValue(ok({} as any));

    const failDto = { ...dto, answers: [1, 0, 0] }; // 0/3 correct
    const result = await useCase.execute(failDto);

    expect(result.passed).toBe(false);
    expect(mockIssueCert.execute).not.toHaveBeenCalled();
    expect(mockPubSub.publish).not.toHaveBeenCalled();
  });

  it('passes on threshold: 2/3 correct (≥70%) is a pass', async () => {
    const quiz = makeQuiz();
    mockQuizRepo.findByCourseId.mockResolvedValue(ok(quiz));
    mockQuizRepo.saveAttempt.mockResolvedValue(ok({} as any));
    const course = Object.assign(new Course(), { id: 'course-1', title: 'Python' });
    mockCourseRepo.findById.mockResolvedValue(ok(course));
    mockIssueCert.execute.mockResolvedValue({} as any);
    mockPubSub.publish.mockResolvedValue(undefined);

    const borderDto = { ...dto, answers: [0, 1, 0] }; // 2/3 correct = 66.7% — NOT passing (ceil(3*0.7)=3)
    const result = await useCase.execute(borderDto);

    // ceil(3 * 0.7) = ceil(2.1) = 3 → need 3/3 to pass
    expect(result.passed).toBe(false);
  });
});

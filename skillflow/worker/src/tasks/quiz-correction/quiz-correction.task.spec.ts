import { QuizCorrectionTask, QuizCorrectionPayload } from './quiz-correction.task';

jest.mock('../../shared/logger', () => ({
  __esModule: true,
  default: {
    info: () => undefined,
    error: () => undefined,
    warn: () => undefined,
    child: () => ({ info: () => undefined, error: () => undefined, warn: () => undefined }),
  },
}));

describe('QuizCorrectionTask', () => {
  it('calculates 3/5 = 60 and passed false (below 70)', async () => {
    const payload: QuizCorrectionPayload = {
      submissionId: 'sub-1',
      answers: [
        { questionId: 'q1', selectedOptionId: 'a' },
        { questionId: 'q2', selectedOptionId: 'b' },
        { questionId: 'q3', selectedOptionId: 'c' },
        { questionId: 'q4', selectedOptionId: 'wrong' },
        { questionId: 'q5', selectedOptionId: 'wrong' },
      ],
      correctAnswers: [
        { questionId: 'q1', correctOptionId: 'a' },
        { questionId: 'q2', correctOptionId: 'b' },
        { questionId: 'q3', correctOptionId: 'c' },
        { questionId: 'q4', correctOptionId: 'd' },
        { questionId: 'q5', correctOptionId: 'e' },
      ],
    };

    const result = await QuizCorrectionTask.execute(payload);

    expect(result.score).toBe(60);
    expect(result.total).toBe(5);
    expect(result.passed).toBe(false);
    expect(result.submissionId).toBe('sub-1');
  });

  it('calculates perfect score 5/5 = 100 and passed true', async () => {
    const payload: QuizCorrectionPayload = {
      submissionId: 'sub-2',
      answers: [
        { questionId: 'q1', selectedOptionId: 'a' },
        { questionId: 'q2', selectedOptionId: 'b' },
        { questionId: 'q3', selectedOptionId: 'c' },
        { questionId: 'q4', selectedOptionId: 'd' },
        { questionId: 'q5', selectedOptionId: 'e' },
      ],
      correctAnswers: [
        { questionId: 'q1', correctOptionId: 'a' },
        { questionId: 'q2', correctOptionId: 'b' },
        { questionId: 'q3', correctOptionId: 'c' },
        { questionId: 'q4', correctOptionId: 'd' },
        { questionId: 'q5', correctOptionId: 'e' },
      ],
    };

    const result = await QuizCorrectionTask.execute(payload);

    expect(result.score).toBe(100);
    expect(result.total).toBe(5);
    expect(result.passed).toBe(true);
  });

  it('returns score 0 for empty answers', async () => {
    const payload: QuizCorrectionPayload = {
      submissionId: 'sub-3',
      answers: [],
      correctAnswers: [
        { questionId: 'q1', correctOptionId: 'a' },
        { questionId: 'q2', correctOptionId: 'b' },
      ],
    };

    const result = await QuizCorrectionTask.execute(payload);

    expect(result.score).toBe(0);
    expect(result.total).toBe(2);
    expect(result.passed).toBe(false);
  });

  it('returns score 0 when answer questionIds do not match correct answers', async () => {
    const payload: QuizCorrectionPayload = {
      submissionId: 'sub-4',
      answers: [
        { questionId: 'wrong-q1', selectedOptionId: 'a' },
        { questionId: 'wrong-q2', selectedOptionId: 'b' },
      ],
      correctAnswers: [
        { questionId: 'q1', correctOptionId: 'a' },
        { questionId: 'q2', correctOptionId: 'b' },
      ],
    };

    const result = await QuizCorrectionTask.execute(payload);

    expect(result.score).toBe(0);
    expect(result.total).toBe(2);
    expect(result.passed).toBe(false);
  });

  it('returns passed true at exactly 70%', async () => {
    const answers = Array.from({ length: 10 }, (_, i) => ({
      questionId: `q${i + 1}`,
      selectedOptionId: i < 7 ? 'correct' : 'wrong',
    }));
    const correctAnswers = Array.from({ length: 10 }, (_, i) => ({
      questionId: `q${i + 1}`,
      correctOptionId: 'correct',
    }));

    const payload: QuizCorrectionPayload = {
      submissionId: 'sub-5',
      answers,
      correctAnswers,
    };

    const result = await QuizCorrectionTask.execute(payload);

    expect(result.score).toBe(70);
    expect(result.total).toBe(10);
    expect(result.passed).toBe(true);
  });
});

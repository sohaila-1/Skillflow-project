import logger from '../../shared/logger';

export type QuizCorrectionPayload = {
  submissionId: string;
  answers: { questionId: string; selectedOptionId: string }[];
  correctAnswers: { questionId: string; correctOptionId: string }[];
};

export type QuizCorrectionResult = {
  submissionId: string;
  score: number;
  total: number;
  passed: boolean;
};

export class QuizCorrectionTask {
  static async execute(payload: unknown): Promise<QuizCorrectionResult> {
    const input = payload as QuizCorrectionPayload;
    logger.info({ submissionId: input.submissionId }, 'Correcting quiz');

    let correct = 0;
    for (const answer of input.answers) {
      const expected = input.correctAnswers.find(
        (ca) => ca.questionId === answer.questionId,
      );
      if (expected?.correctOptionId === answer.selectedOptionId) {
        correct++;
      }
    }

    const total = input.correctAnswers.length;
    const score = total > 0 ? Math.round((correct / total) * 100) : 0;
    const passed = score >= 70;

    return { submissionId: input.submissionId, score, total, passed };
  }
}

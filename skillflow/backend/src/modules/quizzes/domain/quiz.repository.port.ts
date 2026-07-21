import { Result } from 'neverthrow';
import { Quiz } from './quiz.entity';
import { QuizAttempt } from './quiz-attempt.entity';
import { DomainError } from '@shared/errors/domain.error';

export const QUIZ_REPOSITORY = Symbol('QUIZ_REPOSITORY');

export interface QuizRepositoryPort {
  findByCourseId(courseId: string): Promise<Result<Quiz | null, DomainError>>;
  save(quiz: Partial<Quiz>): Promise<Result<Quiz, DomainError>>;
  saveAttempt(attempt: Partial<QuizAttempt>): Promise<Result<QuizAttempt, DomainError>>;
  findAttemptsByUser(userId: string, quizId: string): Promise<Result<QuizAttempt[], DomainError>>;
}

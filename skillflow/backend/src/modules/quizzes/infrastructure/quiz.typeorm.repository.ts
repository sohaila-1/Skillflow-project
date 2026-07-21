import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ok, Result } from 'neverthrow';
import { Quiz } from '../domain/quiz.entity';
import { QuizAttempt } from '../domain/quiz-attempt.entity';
import { QuizRepositoryPort } from '../domain/quiz.repository.port';
import { DomainError } from '@shared/errors/domain.error';

@Injectable()
export class QuizTypeOrmRepository implements QuizRepositoryPort {
  constructor(
    @InjectRepository(Quiz) private readonly quizRepo: Repository<Quiz>,
    @InjectRepository(QuizAttempt) private readonly attemptRepo: Repository<QuizAttempt>,
  ) {}

  async findByCourseId(courseId: string): Promise<Result<Quiz | null, DomainError>> {
    const quiz = await this.quizRepo.findOne({ where: { courseId } });
    return ok(quiz);
  }

  async save(data: Partial<Quiz>): Promise<Result<Quiz, DomainError>> {
    const quiz = await this.quizRepo.save(this.quizRepo.create(data));
    return ok(quiz);
  }

  async saveAttempt(data: Partial<QuizAttempt>): Promise<Result<QuizAttempt, DomainError>> {
    const attempt = await this.attemptRepo.save(this.attemptRepo.create(data));
    return ok(attempt);
  }

  async findAttemptsByUser(userId: string, quizId: string): Promise<Result<QuizAttempt[], DomainError>> {
    const attempts = await this.attemptRepo.find({
      where: { userId, quizId },
      order: { createdAt: 'DESC' },
    });
    return ok(attempts);
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { Review } from '../domain/review.entity';
import { ReviewRepositoryPort, REVIEW_REPOSITORY } from '../domain/review.repository.port';
import { EnrollmentRepositoryPort, ENROLLMENT_REPOSITORY } from '@modules/enrollments/domain/enrollment.repository.port';
import { ConflictError, UnauthorizedError } from '@shared/errors/domain.error';
import { err, ok, Result } from 'neverthrow';

export interface CreateReviewDto {
  userId: string;
  userName: string;
  courseId: string;
  rating: number;
  comment?: string;
}

@Injectable()
export class CreateReviewUseCase {
  constructor(
    @Inject(REVIEW_REPOSITORY) private readonly repo: ReviewRepositoryPort,
    @Inject(ENROLLMENT_REPOSITORY) private readonly enrollmentRepo: EnrollmentRepositoryPort,
  ) {}

  async execute(dto: CreateReviewDto): Promise<Result<Review, ConflictError | UnauthorizedError>> {
    const enrollment = await this.enrollmentRepo.findByUserAndCourse(dto.userId, dto.courseId);
    if (!enrollment) return err(new UnauthorizedError('You must be enrolled to review this course'));

    const existing = await this.repo.findByUserAndCourse(dto.userId, dto.courseId);
    if (existing) return err(new ConflictError('You have already reviewed this course'));

    const review = await this.repo.save({
      userId: dto.userId,
      userName: dto.userName,
      courseId: dto.courseId,
      rating: dto.rating,
      comment: dto.comment ?? null,
    });

    return ok(review);
  }
}

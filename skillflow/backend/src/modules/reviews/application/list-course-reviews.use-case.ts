import { Inject, Injectable } from '@nestjs/common';
import { Review } from '../domain/review.entity';
import { ReviewRepositoryPort, REVIEW_REPOSITORY } from '../domain/review.repository.port';

export interface CourseReviewsResult {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
}

@Injectable()
export class ListCourseReviewsUseCase {
  constructor(
    @Inject(REVIEW_REPOSITORY) private readonly repo: ReviewRepositoryPort,
  ) {}

  async execute(courseId: string): Promise<CourseReviewsResult> {
    const reviews = await this.repo.findByCourse(courseId);
    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews) * 10) / 10
        : 0;

    return { reviews, averageRating, totalReviews };
  }
}

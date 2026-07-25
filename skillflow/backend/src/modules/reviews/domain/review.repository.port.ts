import { Review } from './review.entity';

export interface ReviewRepositoryPort {
  findByUserAndCourse(userId: string, courseId: string): Promise<Review | null>;
  findByCourse(courseId: string): Promise<Review[]>;
  save(review: Partial<Review>): Promise<Review>;
}

export const REVIEW_REPOSITORY = Symbol('ReviewRepositoryPort');

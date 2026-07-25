import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../domain/review.entity';
import { ReviewRepositoryPort } from '../domain/review.repository.port';

@Injectable()
export class ReviewTypeOrmRepository implements ReviewRepositoryPort {
  constructor(
    @InjectRepository(Review)
    private readonly repo: Repository<Review>,
  ) {}

  findByUserAndCourse(userId: string, courseId: string): Promise<Review | null> {
    return this.repo.findOne({ where: { userId, courseId } });
  }

  findByCourse(courseId: string): Promise<Review[]> {
    return this.repo.find({ where: { courseId }, order: { createdAt: 'DESC' } });
  }

  async save(review: Partial<Review>): Promise<Review> {
    return this.repo.save(this.repo.create(review));
  }
}

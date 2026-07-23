import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './domain/review.entity';
import { REVIEW_REPOSITORY } from './domain/review.repository.port';
import { ReviewTypeOrmRepository } from './infrastructure/review.typeorm.repository';
import { CreateReviewUseCase } from './application/create-review.use-case';
import { ListCourseReviewsUseCase } from './application/list-course-reviews.use-case';
import { ReviewsController } from './presentation/reviews.controller';
import { EnrollmentsModule } from '@modules/enrollments/enrollments.module';

@Module({
  imports: [TypeOrmModule.forFeature([Review]), EnrollmentsModule],
  controllers: [ReviewsController],
  providers: [
    CreateReviewUseCase,
    ListCourseReviewsUseCase,
    { provide: REVIEW_REPOSITORY, useClass: ReviewTypeOrmRepository },
  ],
})
export class ReviewsModule {}

import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CreateReviewUseCase } from '../application/create-review.use-case';
import { ListCourseReviewsUseCase } from '../application/list-course-reviews.use-case';
import { CreateReviewDto } from './dto/create-review.dto';
import { CurrentUser } from '@shared/decorators/current-user.decorator';
import { AuthenticatedUser } from '@modules/auth/interfaces/authenticated-user.interface';

@ApiTags('reviews')
@ApiBearerAuth()
@Controller('courses/:courseId/reviews')
export class ReviewsController {
  constructor(
    private readonly createReview: CreateReviewUseCase,
    private readonly listReviews: ListCourseReviewsUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List reviews for a course' })
  list(@Param('courseId') courseId: string) {
    return this.listReviews.execute(courseId);
  }

  @Post()
  @ApiOperation({ summary: 'Submit a review for a course (must be enrolled)' })
  async create(
    @Param('courseId') courseId: string,
    @Body() dto: CreateReviewDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const result = await this.createReview.execute({
      userId: user.sub,
      userName: user.preferred_username,
      courseId,
      rating: dto.rating,
      comment: dto.comment,
    });
    if (result.isErr()) throw result.error;
    return result.value;
  }
}

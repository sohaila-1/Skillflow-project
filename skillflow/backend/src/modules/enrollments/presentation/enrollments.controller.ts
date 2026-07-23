import {
  Controller, Get, Post, Delete,
  Body, Param, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { EnrollUseCase } from '../application/enroll.use-case';
import { ListMyEnrollmentsUseCase } from '../application/list-my-enrollments.use-case';
import { UnenrollUseCase } from '../application/unenroll.use-case';
import { EnrollDto } from './dto/enroll.dto';
import { CurrentUser } from '@shared/decorators/current-user.decorator';
import { AuthenticatedUser } from '@modules/auth/interfaces/authenticated-user.interface';
import { GetCourseUseCase } from '@modules/courses/application/get-course.use-case';
import { GetMySubscriptionUseCase } from '@modules/subscriptions/application/get-my-subscription.use-case';
import { PaymentRequiredError } from '@shared/errors/domain.error';

@ApiTags('enrollments')
@ApiBearerAuth()
@Controller('enrollments')
export class EnrollmentsController {
  constructor(
    private readonly enroll: EnrollUseCase,
    private readonly listMy: ListMyEnrollmentsUseCase,
    private readonly unenroll: UnenrollUseCase,
    private readonly getCourse: GetCourseUseCase,
    private readonly getMySubscription: GetMySubscriptionUseCase,
  ) {}

  @Get('me')
  async myEnrollments(@CurrentUser() user: AuthenticatedUser) {
    const result = await this.listMy.execute(user.sub);
    if (result.isErr()) throw result.error;
    return result.value;
  }

  @Post()
  async enrollInCourse(@Body() dto: EnrollDto, @CurrentUser() user: AuthenticatedUser) {
    const courseResult = await this.getCourse.execute(dto.courseId);
    if (courseResult.isErr()) throw courseResult.error;

    const course = courseResult.value;
    if (course.isPremium) {
      const sub = await this.getMySubscription.execute(user.sub);
      if (!sub?.isActive) {
        throw new PaymentRequiredError('This course requires an active Premium subscription');
      }
    }

    const result = await this.enroll.execute(user.sub, dto.courseId);
    if (result.isErr()) throw result.error;
    return result.value;
  }

  @Delete(':courseId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async unenrollFromCourse(@Param('courseId') courseId: string, @CurrentUser() user: AuthenticatedUser) {
    const result = await this.unenroll.execute(user.sub, courseId);
    if (result.isErr()) throw result.error;
  }
}

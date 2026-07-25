import { Controller, Get, Patch, Param, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { GetCourseProgressUseCase } from '../application/get-course-progress.use-case';
import { MarkLessonCompleteUseCase } from '../application/mark-lesson-complete.use-case';
import { CurrentUser } from '@shared/decorators/current-user.decorator';
import { AuthenticatedUser } from '@modules/auth/interfaces/authenticated-user.interface';

@ApiTags('progress')
@ApiBearerAuth()
@Controller('courses/:courseId/progress')
export class ProgressController {
  constructor(
    private readonly getProgress: GetCourseProgressUseCase,
    private readonly markComplete: MarkLessonCompleteUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get my progress for a course' })
  getMyProgress(
    @Param('courseId') courseId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.getProgress.execute(user.sub, courseId);
  }

  @Patch('lessons/:sectionIndex/:lessonIndex/complete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark a lesson as complete' })
  markLessonComplete(
    @Param('courseId') courseId: string,
    @Param('sectionIndex', ParseIntPipe) sectionIndex: number,
    @Param('lessonIndex', ParseIntPipe) lessonIndex: number,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.markComplete.execute(user.sub, courseId, sectionIndex, lessonIndex);
  }
}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseProgress } from './domain/course-progress.entity';
import { PROGRESS_REPOSITORY } from './domain/progress.repository.port';
import { ProgressTypeOrmRepository } from './infrastructure/progress.typeorm.repository';
import { GetCourseProgressUseCase } from './application/get-course-progress.use-case';
import { MarkLessonCompleteUseCase } from './application/mark-lesson-complete.use-case';
import { ProgressController } from './presentation/progress.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CourseProgress])],
  controllers: [ProgressController],
  providers: [
    GetCourseProgressUseCase,
    MarkLessonCompleteUseCase,
    { provide: PROGRESS_REPOSITORY, useClass: ProgressTypeOrmRepository },
  ],
})
export class ProgressModule {}

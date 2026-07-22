import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './domain/course.entity';
import { COURSE_REPOSITORY } from './domain/course.repository.port';
import { CourseTypeOrmRepository } from './infrastructure/course.typeorm.repository';
import { GetCourseUseCase } from './application/get-course.use-case';
import { CreateCourseUseCase } from './application/create-course.use-case';
import { ListCoursesUseCase } from './application/list-courses.use-case';
import { UpdateCourseUseCase } from './application/update-course.use-case';
import { DeleteCourseUseCase } from './application/delete-course.use-case';
import { CoursesController } from './presentation/courses.controller';
import { CoursesV2Controller } from './presentation/courses-v2.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Course])],
  controllers: [CoursesController, CoursesV2Controller],
  providers: [
    GetCourseUseCase,
    CreateCourseUseCase,
    ListCoursesUseCase,
    UpdateCourseUseCase,
    DeleteCourseUseCase,
    {
      provide: COURSE_REPOSITORY,
      useClass: CourseTypeOrmRepository,
    },
  ],
  exports: [GetCourseUseCase, COURSE_REPOSITORY],
})
export class CoursesModule {}

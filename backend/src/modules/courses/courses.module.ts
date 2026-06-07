import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './domain/course.entity';
import { COURSE_REPOSITORY } from './domain/course.repository.port';
import { GetCourseUseCase } from './application/get-course.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([Course])],
  providers: [
    GetCourseUseCase,
    {
      provide: COURSE_REPOSITORY,
      // Infrastructure adapter — will be implemented in infrastructure/
      useClass: class {} as never,
    },
  ],
  exports: [GetCourseUseCase],
})
export class CoursesModule {}

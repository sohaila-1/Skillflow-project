import { Inject, Injectable } from '@nestjs/common';
import { Result } from 'neverthrow';
import { Course } from '../domain/course.entity';
import { CourseRepositoryPort, COURSE_REPOSITORY } from '../domain/course.repository.port';
import { DomainError } from '@shared/errors/domain.error';

@Injectable()
export class GetCourseUseCase {
  constructor(
    @Inject(COURSE_REPOSITORY)
    private readonly courseRepository: CourseRepositoryPort,
  ) {}

  async execute(courseId: string): Promise<Result<Course, DomainError>> {
    return this.courseRepository.findById(courseId);
  }
}

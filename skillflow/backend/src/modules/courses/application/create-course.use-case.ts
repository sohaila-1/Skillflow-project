import { Inject, Injectable } from '@nestjs/common';
import { Result } from 'neverthrow';
import { Course } from '../domain/course.entity';
import { CourseRepositoryPort, COURSE_REPOSITORY } from '../domain/course.repository.port';
import { DomainError } from '@shared/errors/domain.error';
import { CreateCourseDto } from '../presentation/dto/create-course.dto';

@Injectable()
export class CreateCourseUseCase {
  constructor(
    @Inject(COURSE_REPOSITORY)
    private readonly repo: CourseRepositoryPort,
  ) {}

  async execute(dto: CreateCourseDto, instructorId: string): Promise<Result<Course, DomainError>> {
    const course = new Course();
    course.title = dto.title;
    course.description = dto.description;
    course.instructorId = instructorId;
    course.published = dto.published ?? false;
    return this.repo.save(course);
  }
}

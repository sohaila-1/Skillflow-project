import { Inject, Injectable } from '@nestjs/common';
import { err, Result } from 'neverthrow';
import { Course } from '../domain/course.entity';
import { CourseRepositoryPort, COURSE_REPOSITORY } from '../domain/course.repository.port';
import { DomainError, UnauthorizedError } from '@shared/errors/domain.error';
import { UpdateCourseDto } from '../presentation/dto/update-course.dto';

@Injectable()
export class UpdateCourseUseCase {
  constructor(
    @Inject(COURSE_REPOSITORY)
    private readonly repo: CourseRepositoryPort,
  ) {}

  async execute(id: string, dto: UpdateCourseDto, requesterId: string): Promise<Result<Course, DomainError>> {
    const result = await this.repo.findById(id);
    if (result.isErr()) return result;

    const course = result.value;
    if (course.instructorId !== requesterId) {
      return err(new UnauthorizedError('You can only update your own courses'));
    }

    if (dto.title !== undefined) course.title = dto.title;
    if (dto.description !== undefined) course.description = dto.description;
    if (dto.published !== undefined) course.published = dto.published;

    return this.repo.save(course);
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { err, Result } from 'neverthrow';
import { CourseRepositoryPort, COURSE_REPOSITORY } from '../domain/course.repository.port';
import { DomainError, UnauthorizedError } from '@shared/errors/domain.error';

@Injectable()
export class DeleteCourseUseCase {
  constructor(
    @Inject(COURSE_REPOSITORY)
    private readonly repo: CourseRepositoryPort,
  ) {}

  async execute(id: string, requesterId: string): Promise<Result<void, DomainError>> {
    const result = await this.repo.findById(id);
    if (result.isErr()) return err(result.error);

    const course = result.value;
    if (course.instructorId !== requesterId) {
      return err(new UnauthorizedError('You can only delete your own courses'));
    }

    return this.repo.delete(id);
  }
}

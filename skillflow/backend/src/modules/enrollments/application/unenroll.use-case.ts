import { Inject, Injectable } from '@nestjs/common';
import { err, Result } from 'neverthrow';
import { EnrollmentRepositoryPort, ENROLLMENT_REPOSITORY } from '../domain/enrollment.repository.port';
import { DomainError, NotFoundError } from '@shared/errors/domain.error';

@Injectable()
export class UnenrollUseCase {
  constructor(
    @Inject(ENROLLMENT_REPOSITORY)
    private readonly repo: EnrollmentRepositoryPort,
  ) {}

  async execute(userId: string, courseId: string): Promise<Result<void, DomainError>> {
    const existing = await this.repo.findByUserAndCourse(userId, courseId);
    if (!existing) return err(new NotFoundError('Enrollment', courseId));
    return this.repo.delete(userId, courseId);
  }
}

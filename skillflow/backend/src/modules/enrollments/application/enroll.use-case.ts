import { Inject, Injectable } from '@nestjs/common';
import { err, Result } from 'neverthrow';
import { Enrollment } from '../domain/enrollment.entity';
import { EnrollmentRepositoryPort, ENROLLMENT_REPOSITORY } from '../domain/enrollment.repository.port';
import { DomainError, ConflictError } from '@shared/errors/domain.error';

@Injectable()
export class EnrollUseCase {
  constructor(
    @Inject(ENROLLMENT_REPOSITORY)
    private readonly repo: EnrollmentRepositoryPort,
  ) {}

  async execute(userId: string, courseId: string): Promise<Result<Enrollment, DomainError>> {
    const existing = await this.repo.findByUserAndCourse(userId, courseId);
    if (existing) return err(new ConflictError('Already enrolled in this course'));

    const enrollment = new Enrollment();
    enrollment.userId = userId;
    enrollment.courseId = courseId;
    return this.repo.save(enrollment);
  }
}

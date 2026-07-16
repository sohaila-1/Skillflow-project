import { Inject, Injectable } from '@nestjs/common';
import { Result } from 'neverthrow';
import { Enrollment } from '../domain/enrollment.entity';
import { EnrollmentRepositoryPort, ENROLLMENT_REPOSITORY } from '../domain/enrollment.repository.port';
import { DomainError } from '@shared/errors/domain.error';

@Injectable()
export class ListMyEnrollmentsUseCase {
  constructor(
    @Inject(ENROLLMENT_REPOSITORY)
    private readonly repo: EnrollmentRepositoryPort,
  ) {}

  async execute(userId: string): Promise<Result<Enrollment[], DomainError>> {
    return this.repo.findByUser(userId);
  }
}

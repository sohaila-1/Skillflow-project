import { Result } from 'neverthrow';
import { Enrollment } from './enrollment.entity';
import { DomainError } from '@shared/errors/domain.error';

export interface EnrollmentRepositoryPort {
  findByUser(userId: string): Promise<Result<Enrollment[], DomainError>>;
  findByUserAndCourse(userId: string, courseId: string): Promise<Enrollment | null>;
  save(enrollment: Enrollment): Promise<Result<Enrollment, DomainError>>;
  delete(userId: string, courseId: string): Promise<Result<void, DomainError>>;
}

export const ENROLLMENT_REPOSITORY = Symbol('EnrollmentRepositoryPort');

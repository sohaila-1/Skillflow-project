import { Result } from 'neverthrow';
import { Course } from './course.entity';
import { DomainError } from '@shared/errors/domain.error';

export interface CourseRepositoryPort {
  findById(id: string): Promise<Result<Course, DomainError>>;
  findAll(): Promise<Result<Course[], DomainError>>;
  findByInstructor(instructorId: string): Promise<Result<Course[], DomainError>>;
  save(course: Course): Promise<Result<Course, DomainError>>;
  delete(id: string): Promise<Result<void, DomainError>>;
}

export const COURSE_REPOSITORY = Symbol('CourseRepositoryPort');

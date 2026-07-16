import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ok, Result } from 'neverthrow';
import { Enrollment } from '../domain/enrollment.entity';
import { EnrollmentRepositoryPort } from '../domain/enrollment.repository.port';
import { DomainError } from '@shared/errors/domain.error';

@Injectable()
export class EnrollmentTypeOrmRepository implements EnrollmentRepositoryPort {
  constructor(
    @InjectRepository(Enrollment)
    private readonly repo: Repository<Enrollment>,
  ) {}

  async findByUser(userId: string): Promise<Result<Enrollment[], DomainError>> {
    return ok(await this.repo.find({ where: { userId }, order: { enrolledAt: 'DESC' } }));
  }

  async findByUserAndCourse(userId: string, courseId: string): Promise<Enrollment | null> {
    return this.repo.findOne({ where: { userId, courseId } });
  }

  async save(enrollment: Enrollment): Promise<Result<Enrollment, DomainError>> {
    return ok(await this.repo.save(enrollment));
  }

  async delete(userId: string, courseId: string): Promise<Result<void, DomainError>> {
    await this.repo.delete({ userId, courseId });
    return ok(undefined);
  }
}

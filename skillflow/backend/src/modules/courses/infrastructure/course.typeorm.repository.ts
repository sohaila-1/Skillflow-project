import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ok, err, Result } from 'neverthrow';
import { Course } from '../domain/course.entity';
import { CourseRepositoryPort } from '../domain/course.repository.port';
import { DomainError, NotFoundError } from '@shared/errors/domain.error';

@Injectable()
export class CourseTypeOrmRepository implements CourseRepositoryPort {
  constructor(
    @InjectRepository(Course)
    private readonly repo: Repository<Course>,
  ) {}

  async findById(id: string): Promise<Result<Course, DomainError>> {
    const course = await this.repo.findOne({ where: { id } });
    if (!course) return err(new NotFoundError('Course', id));
    return ok(course);
  }

  async findAll(): Promise<Result<Course[], DomainError>> {
    return ok(await this.repo.find({ order: { createdAt: 'DESC' } }));
  }

  async findByInstructor(instructorId: string): Promise<Result<Course[], DomainError>> {
    return ok(await this.repo.find({ where: { instructorId }, order: { createdAt: 'DESC' } }));
  }

  async save(course: Course): Promise<Result<Course, DomainError>> {
    return ok(await this.repo.save(course));
  }

  async delete(id: string): Promise<Result<void, DomainError>> {
    await this.repo.delete(id);
    return ok(undefined);
  }
}

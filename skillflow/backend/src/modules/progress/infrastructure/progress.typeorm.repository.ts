import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CourseProgress } from '../domain/course-progress.entity';
import { ProgressRepositoryPort } from '../domain/progress.repository.port';

@Injectable()
export class ProgressTypeOrmRepository implements ProgressRepositoryPort {
  constructor(
    @InjectRepository(CourseProgress)
    private readonly repo: Repository<CourseProgress>,
  ) {}

  findByUserAndCourse(userId: string, courseId: string): Promise<CourseProgress | null> {
    return this.repo.findOne({ where: { userId, courseId } });
  }

  async markLessonComplete(userId: string, courseId: string, lessonId: string): Promise<CourseProgress> {
    let progress = await this.repo.findOne({ where: { userId, courseId } });

    if (!progress) {
      progress = this.repo.create({ userId, courseId, completedLessonIds: [] });
    }

    if (!progress.completedLessonIds.includes(lessonId)) {
      progress.completedLessonIds = [...progress.completedLessonIds, lessonId];
    }

    return this.repo.save(progress);
  }
}

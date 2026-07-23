import { Inject, Injectable } from '@nestjs/common';
import { CourseProgress } from '../domain/course-progress.entity';
import { ProgressRepositoryPort, PROGRESS_REPOSITORY } from '../domain/progress.repository.port';

@Injectable()
export class GetCourseProgressUseCase {
  constructor(
    @Inject(PROGRESS_REPOSITORY)
    private readonly repo: ProgressRepositoryPort,
  ) {}

  async execute(userId: string, courseId: string): Promise<CourseProgress> {
    const progress = await this.repo.findByUserAndCourse(userId, courseId);
    if (progress) return progress;

    const empty = new CourseProgress();
    empty.userId = userId;
    empty.courseId = courseId;
    empty.completedLessonIds = [];
    return empty;
  }
}

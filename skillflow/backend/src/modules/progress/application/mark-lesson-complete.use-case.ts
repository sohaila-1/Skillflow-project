import { Inject, Injectable } from '@nestjs/common';
import { CourseProgress } from '../domain/course-progress.entity';
import { ProgressRepositoryPort, PROGRESS_REPOSITORY } from '../domain/progress.repository.port';

@Injectable()
export class MarkLessonCompleteUseCase {
  constructor(
    @Inject(PROGRESS_REPOSITORY)
    private readonly repo: ProgressRepositoryPort,
  ) {}

  execute(userId: string, courseId: string, sectionIndex: number, lessonIndex: number): Promise<CourseProgress> {
    const lessonId = `${sectionIndex}_${lessonIndex}`;
    return this.repo.markLessonComplete(userId, courseId, lessonId);
  }
}

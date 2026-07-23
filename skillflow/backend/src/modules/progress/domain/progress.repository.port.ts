import { CourseProgress } from './course-progress.entity';

export interface ProgressRepositoryPort {
  findByUserAndCourse(userId: string, courseId: string): Promise<CourseProgress | null>;
  markLessonComplete(userId: string, courseId: string, lessonId: string): Promise<CourseProgress>;
}

export const PROGRESS_REPOSITORY = Symbol('ProgressRepositoryPort');

import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn } from 'typeorm';

@Entity('course_progress')
export class CourseProgress {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id' })
  userId!: string;

  @Column({ name: 'course_id' })
  courseId!: string;

  @Column({ type: 'jsonb', default: '[]', name: 'completed_lesson_ids' })
  completedLessonIds!: string[];

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}

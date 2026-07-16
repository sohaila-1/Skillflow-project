import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('enrollments')
export class Enrollment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id' })
  userId!: string;

  @Column({ name: 'course_id' })
  courseId!: string;

  @CreateDateColumn({ name: 'enrolled_at' })
  enrolledAt!: Date;
}

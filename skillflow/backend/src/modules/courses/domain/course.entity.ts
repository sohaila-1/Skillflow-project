import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export interface CourseLesson {
  title: string;
  duration: string;
  content: string;
}

export interface CourseSection {
  title: string;
  lessons: CourseLesson[];
}

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 255 })
  title!: string;

  @Column('text')
  description!: string;

  @Column({ name: 'instructor_id' })
  instructorId!: string;

  @Column({ length: 100, default: 'General' })
  category!: string;

  @Column({ length: 50, default: 'Beginner' })
  level!: string;

  @Column({ type: 'jsonb', default: [] })
  sections!: CourseSection[];

  @Column({ default: false })
  published!: boolean;

  @Column({ name: 'is_premium', default: false })
  isPremium!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}

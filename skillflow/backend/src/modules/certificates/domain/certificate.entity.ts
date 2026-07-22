import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('certificates')
export class Certificate {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id' })
  userId!: string;

  @Column({ name: 'course_id' })
  courseId!: string;

  @Column({ name: 'course_title', length: 255 })
  courseTitle!: string;

  @Column({ name: 'student_name', length: 200 })
  studentName!: string;

  @Column({ type: 'int' })
  score!: number;

  @Column({ name: 'total_questions', type: 'int' })
  totalQuestions!: number;

  @Column({ name: 'email_sent', default: false })
  emailSent!: boolean;

  @CreateDateColumn({ name: 'issued_at' })
  issuedAt!: Date;
}

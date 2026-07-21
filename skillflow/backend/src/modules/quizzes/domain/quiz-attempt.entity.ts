import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('quiz_attempts')
export class QuizAttempt {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'quiz_id' })
  quizId!: string;

  @Column({ name: 'user_id' })
  userId!: string;

  @Column()
  score!: number;

  @Column({ name: 'total_questions' })
  totalQuestions!: number;

  @Column({ type: 'jsonb' })
  answers!: number[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}

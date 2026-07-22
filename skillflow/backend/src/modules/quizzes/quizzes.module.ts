import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quiz } from './domain/quiz.entity';
import { QuizAttempt } from './domain/quiz-attempt.entity';
import { QuizTypeOrmRepository } from './infrastructure/quiz.typeorm.repository';
import { QuizzesController } from './presentation/quizzes.controller';
import { QUIZ_REPOSITORY } from './domain/quiz.repository.port';
import { CertificatesModule } from '@modules/certificates/certificates.module';
import { CoursesModule } from '@modules/courses/courses.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Quiz, QuizAttempt]),
    CertificatesModule,
    CoursesModule,
  ],
  controllers: [QuizzesController],
  providers: [
    { provide: QUIZ_REPOSITORY, useClass: QuizTypeOrmRepository },
  ],
})
export class QuizzesModule {}

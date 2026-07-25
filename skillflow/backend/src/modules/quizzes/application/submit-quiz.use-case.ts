import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { QuizRepositoryPort, QUIZ_REPOSITORY } from '../domain/quiz.repository.port';
import { CourseRepositoryPort, COURSE_REPOSITORY } from '@modules/courses/domain/course.repository.port';
import { IssueCertificateUseCase } from '@modules/certificates/application/issue-certificate.use-case';
import { PubSubService } from '@shared/pubsub/pubsub.service';

export interface SubmitQuizDto {
  courseId: string;
  userId: string;
  studentName: string;
  studentEmail: string;
  answers: number[];
}

export interface SubmitQuizResult {
  score: number;
  total: number;
  percentage: number;
  passed: boolean;
}

@Injectable()
export class SubmitQuizUseCase {
  constructor(
    @Inject(QUIZ_REPOSITORY) private readonly quizRepo: QuizRepositoryPort,
    @Inject(COURSE_REPOSITORY) private readonly courseRepo: CourseRepositoryPort,
    private readonly issueCertificate: IssueCertificateUseCase,
    private readonly pubsub: PubSubService,
  ) {}

  async execute(dto: SubmitQuizDto): Promise<SubmitQuizResult> {
    const quizResult = await this.quizRepo.findByCourseId(dto.courseId);
    if (quizResult.isErr()) throw quizResult.error;
    if (!quizResult.value) throw new NotFoundException('No quiz for this course');

    const quiz = quizResult.value;
    const score = quiz.questions.reduce(
      (acc, q, i) => acc + (dto.answers[i] === q.correctIndex ? 1 : 0),
      0,
    );

    await this.quizRepo.saveAttempt({
      quizId: quiz.id,
      userId: dto.userId,
      score,
      totalQuestions: quiz.questions.length,
      answers: dto.answers,
    });

    const passed = score >= Math.ceil(quiz.questions.length * 0.7);

    if (passed) {
      const courseResult = await this.courseRepo.findById(dto.courseId);
      if (courseResult.isOk() && courseResult.value) {
        const course = courseResult.value;
        await this.issueCertificate.execute({
          userId: dto.userId,
          courseId: dto.courseId,
          courseTitle: course.title,
          studentName: dto.studentName,
          score,
          totalQuestions: quiz.questions.length,
        });

        void this.pubsub.publish('CERTIFICATE_GENERATION', {
          userId: dto.userId,
          courseId: dto.courseId,
          courseTitle: course.title,
          studentName: dto.studentName,
          studentEmail: dto.studentEmail,
          score,
          totalQuestions: quiz.questions.length,
          completedAt: new Date().toISOString(),
        });
      }
    }

    return {
      score,
      total: quiz.questions.length,
      percentage: Math.round((score / quiz.questions.length) * 100),
      passed,
    };
  }
}

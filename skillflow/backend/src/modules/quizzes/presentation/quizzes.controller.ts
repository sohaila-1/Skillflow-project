import { Controller, Get, Post, Body, Param, HttpCode, HttpStatus, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '@shared/decorators/roles.decorator';
import { CurrentUser } from '@shared/decorators/current-user.decorator';
import { AuthenticatedUser } from '@modules/auth/interfaces/authenticated-user.interface';
import { QuizRepositoryPort, QUIZ_REPOSITORY } from '../domain/quiz.repository.port';
import { Inject } from '@nestjs/common';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { SubmitQuizDto as SubmitQuizBodyDto } from './dto/submit-quiz.dto';
import { randomUUID } from 'crypto';
import { SubmitQuizUseCase } from '../application/submit-quiz.use-case';

@ApiTags('quizzes')
@ApiBearerAuth()
@Controller('courses/:courseId/quiz')
export class QuizzesController {
  constructor(
    @Inject(QUIZ_REPOSITORY) private readonly quizRepo: QuizRepositoryPort,
    private readonly submitQuiz: SubmitQuizUseCase,
  ) {}

  @Get()
  async getQuiz(@Param('courseId') courseId: string) {
    const result = await this.quizRepo.findByCourseId(courseId);
    if (result.isErr()) throw result.error;
    if (!result.value) throw new NotFoundException('No quiz for this course');
    const quiz = result.value;
    return {
      id: quiz.id,
      title: quiz.title,
      courseId: quiz.courseId,
      questions: quiz.questions.map(q => ({
        id: q.id,
        text: q.text,
        options: q.options,
      })),
    };
  }

  @Post()
  @Roles('instructor', 'admin')
  async createQuiz(
    @Param('courseId') courseId: string,
    @Body() dto: CreateQuizDto,
  ) {
    const result = await this.quizRepo.save({
      courseId,
      title: dto.title,
      questions: dto.questions.map(q => ({ ...q, id: randomUUID() })),
    });
    if (result.isErr()) throw result.error;
    return result.value;
  }

  @Post('submit')
  @HttpCode(HttpStatus.OK)
  async submit(
    @Param('courseId') courseId: string,
    @Body() dto: SubmitQuizBodyDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.submitQuiz.execute({
      courseId,
      userId: user.sub,
      studentName: user.preferred_username,
      studentEmail: user.email,
      answers: dto.answers,
    });
  }

  @Get('attempts')
  async myAttempts(
    @Param('courseId') courseId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const quizResult = await this.quizRepo.findByCourseId(courseId);
    if (quizResult.isErr()) throw quizResult.error;
    if (!quizResult.value) return [];

    const result = await this.quizRepo.findAttemptsByUser(user.sub, quizResult.value.id);
    if (result.isErr()) throw result.error;
    return result.value;
  }
}

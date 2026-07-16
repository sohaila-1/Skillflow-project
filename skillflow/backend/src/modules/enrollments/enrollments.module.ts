import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Enrollment } from './domain/enrollment.entity';
import { ENROLLMENT_REPOSITORY } from './domain/enrollment.repository.port';
import { EnrollmentTypeOrmRepository } from './infrastructure/enrollment.typeorm.repository';
import { EnrollUseCase } from './application/enroll.use-case';
import { ListMyEnrollmentsUseCase } from './application/list-my-enrollments.use-case';
import { UnenrollUseCase } from './application/unenroll.use-case';
import { EnrollmentsController } from './presentation/enrollments.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Enrollment])],
  controllers: [EnrollmentsController],
  providers: [
    EnrollUseCase,
    ListMyEnrollmentsUseCase,
    UnenrollUseCase,
    {
      provide: ENROLLMENT_REPOSITORY,
      useClass: EnrollmentTypeOrmRepository,
    },
  ],
})
export class EnrollmentsModule {}

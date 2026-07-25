import { Inject, Injectable } from '@nestjs/common';
import { Certificate } from '../domain/certificate.entity';
import {
  CertificateRepositoryPort,
  CERTIFICATE_REPOSITORY,
} from '../domain/certificate.repository.port';

export interface IssueCertificateDto {
  userId: string;
  courseId: string;
  courseTitle: string;
  studentName: string;
  score: number;
  totalQuestions: number;
}

@Injectable()
export class IssueCertificateUseCase {
  constructor(
    @Inject(CERTIFICATE_REPOSITORY)
    private readonly repo: CertificateRepositoryPort,
  ) {}

  async execute(dto: IssueCertificateDto): Promise<Certificate> {
    const existing = await this.repo.findByUserAndCourse(dto.userId, dto.courseId);
    if (existing) return existing;
    return this.repo.save(dto);
  }

  findByUser(userId: string): Promise<Certificate[]> {
    return this.repo.findByUser(userId);
  }

  findById(id: string): Promise<Certificate | null> {
    return this.repo.findById(id);
  }

  markEmailStatus(userId: string, courseId: string, emailSent: boolean): Promise<void> {
    return this.repo.markEmailSent(userId, courseId, emailSent);
  }
}

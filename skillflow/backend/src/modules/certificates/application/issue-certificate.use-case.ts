import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Certificate } from '../domain/certificate.entity';

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
    @InjectRepository(Certificate)
    private readonly repo: Repository<Certificate>,
  ) {}

  async execute(dto: IssueCertificateDto): Promise<Certificate> {
    const existing = await this.repo.findOne({
      where: { userId: dto.userId, courseId: dto.courseId },
    });
    if (existing) return existing;

    const cert = this.repo.create(dto);
    return this.repo.save(cert);
  }

  async findByUser(userId: string): Promise<Certificate[]> {
    return this.repo.find({ where: { userId }, order: { issuedAt: 'DESC' } });
  }

  async markEmailStatus(userId: string, courseId: string, emailSent: boolean): Promise<void> {
    await this.repo.update({ userId, courseId }, { emailSent });
  }
}

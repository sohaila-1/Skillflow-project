import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Certificate } from '../domain/certificate.entity';
import { CertificateRepositoryPort } from '../domain/certificate.repository.port';

@Injectable()
export class CertificateTypeOrmRepository implements CertificateRepositoryPort {
  constructor(
    @InjectRepository(Certificate)
    private readonly repo: Repository<Certificate>,
  ) {}

  findByUserAndCourse(userId: string, courseId: string): Promise<Certificate | null> {
    return this.repo.findOne({ where: { userId, courseId } });
  }

  findById(id: string): Promise<Certificate | null> {
    return this.repo.findOne({ where: { id } });
  }

  findByUser(userId: string): Promise<Certificate[]> {
    return this.repo.find({ where: { userId }, order: { issuedAt: 'DESC' } });
  }

  async save(cert: Partial<Certificate>): Promise<Certificate> {
    return this.repo.save(cert);
  }

  async markEmailSent(userId: string, courseId: string, emailSent: boolean): Promise<void> {
    await this.repo.update({ userId, courseId }, { emailSent });
  }
}

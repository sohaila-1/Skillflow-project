import { Certificate } from './certificate.entity';

export interface CertificateRepositoryPort {
  findByUserAndCourse(userId: string, courseId: string): Promise<Certificate | null>;
  findById(id: string): Promise<Certificate | null>;
  findByUser(userId: string): Promise<Certificate[]>;
  save(cert: Partial<Certificate>): Promise<Certificate>;
  markEmailSent(userId: string, courseId: string, emailSent: boolean): Promise<void>;
}

export const CERTIFICATE_REPOSITORY = Symbol('CertificateRepositoryPort');

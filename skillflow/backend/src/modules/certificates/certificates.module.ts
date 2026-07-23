import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Certificate } from './domain/certificate.entity';
import { CERTIFICATE_REPOSITORY } from './domain/certificate.repository.port';
import { CertificateTypeOrmRepository } from './infrastructure/certificate.typeorm.repository';
import { IssueCertificateUseCase } from './application/issue-certificate.use-case';
import { CertificatesController } from './presentation/certificates.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Certificate])],
  controllers: [CertificatesController],
  providers: [
    IssueCertificateUseCase,
    {
      provide: CERTIFICATE_REPOSITORY,
      useClass: CertificateTypeOrmRepository,
    },
  ],
  exports: [IssueCertificateUseCase],
})
export class CertificatesModule {}

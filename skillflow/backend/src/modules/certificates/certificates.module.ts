import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Certificate } from './domain/certificate.entity';
import { IssueCertificateUseCase } from './application/issue-certificate.use-case';
import { CertificatesController } from './presentation/certificates.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Certificate])],
  controllers: [CertificatesController],
  providers: [IssueCertificateUseCase],
  exports: [IssueCertificateUseCase],
})
export class CertificatesModule {}

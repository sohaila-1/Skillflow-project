import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from '@shared/decorators/current-user.decorator';
import { AuthenticatedUser } from '@modules/auth/interfaces/authenticated-user.interface';
import { IssueCertificateUseCase } from '../application/issue-certificate.use-case';

@ApiTags('certificates')
@ApiBearerAuth()
@Controller('certificates')
export class CertificatesController {
  constructor(private readonly useCase: IssueCertificateUseCase) {}

  @Get('me')
  async myCertificates(@CurrentUser() user: AuthenticatedUser) {
    return this.useCase.findByUser(user.sub);
  }
}

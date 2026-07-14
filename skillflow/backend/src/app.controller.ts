import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from './shared/decorators/public.decorator';
import { CurrentUser } from './shared/decorators/current-user.decorator';
import { AuthenticatedUser } from './modules/auth/interfaces/authenticated-user.interface';

@ApiTags('App')
@Controller()
export class AppController {
  @Public()
  @Get('health')
  @ApiOperation({ summary: 'Health check — public, pas de token requis' })
  health(): { status: string; timestamp: string } {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }

  @Get('me')
  @ApiOperation({ summary: 'Retourne les infos du token — JWT requis' })
  me(@CurrentUser() user: AuthenticatedUser): AuthenticatedUser {
    return user;
  }
}

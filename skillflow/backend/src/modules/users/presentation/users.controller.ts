import { Controller, Get, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from '@shared/decorators/current-user.decorator';
import { AuthenticatedUser } from '@modules/auth/interfaces/authenticated-user.interface';
import { SyncUserUseCase } from '../application/sync-user.use-case';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly syncUser: SyncUserUseCase) {}

  @Get('me')
  async getMe(@CurrentUser() user: AuthenticatedUser) {
    return this.syncUser.execute(user);
  }

  @Post('sync')
  @HttpCode(HttpStatus.OK)
  async sync(@CurrentUser() user: AuthenticatedUser) {
    return this.syncUser.execute(user);
  }
}

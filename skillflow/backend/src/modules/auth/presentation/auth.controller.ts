import { Controller, Get, Delete, Post, Patch, Body, HttpCode, HttpStatus, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength, IsOptional } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CurrentUser } from '@shared/decorators/current-user.decorator';
import { Public } from '@shared/decorators/public.decorator';
import { AuthenticatedUser } from '../interfaces/authenticated-user.interface';
import { KeycloakAdminService, TokenIntrospection } from '../infrastructure/keycloak-admin.service';
import { User } from '@modules/users/domain/user.entity';

class IntrospectTokenDto {
  @ApiProperty({ description: 'JWT access token to validate' })
  @IsString()
  @IsNotEmpty()
  token!: string;
}

class UpdateProfileDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  lastName?: string;
}

class ChangePasswordDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  currentPassword!: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  newPassword!: string;
}

class UploadAvatarDto {
  @ApiProperty({ description: 'Base64 data URL of the avatar image' })
  @IsString()
  @IsNotEmpty()
  avatarUrl!: string;
}

@ApiTags('auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly adminService: KeycloakAdminService,
    private readonly config: ConfigService,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  @Get('me')
  @ApiOperation({ summary: 'Return current authenticated user from JWT claims' })
  @ApiResponse({ status: 200, description: 'Authenticated user payload' })
  me(@CurrentUser() user: AuthenticatedUser): AuthenticatedUser {
    return user;
  }

  @Get('2fa/status')
  @ApiOperation({ summary: 'Check whether TOTP is enabled for the current user' })
  @ApiResponse({ status: 200, schema: { properties: { enabled: { type: 'boolean' } } } })
  async totpStatus(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<{ enabled: boolean }> {
    const enabled = await this.adminService.isTotpEnabled(user.sub);
    return { enabled };
  }

  @Post('2fa/setup')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Set CONFIGURE_TOTP required action and return Keycloak login URL' })
  async setupTotp(@CurrentUser() user: AuthenticatedUser): Promise<{ loginUrl: string }> {
    await this.adminService.setRequiredAction(user.sub, 'CONFIGURE_TOTP');
    const issuer = this.config.get('KEYCLOAK_ISSUER', 'http://localhost:8080');
    const realm  = this.config.get('KEYCLOAK_REALM', 'skillflow');
    const redirectUri = encodeURIComponent(
      `${this.config.get('FRONTEND_URL', 'http://localhost:4000')}/account`,
    );
    const loginUrl =
      `${issuer}/realms/${realm}/protocol/openid-connect/auth` +
      `?client_id=skillflow-frontend&redirect_uri=${redirectUri}` +
      `&response_type=code&scope=openid&prompt=login`;
    return { loginUrl };
  }

  @Delete('2fa')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Disable TOTP for the current user via Keycloak Admin API' })
  @ApiResponse({ status: 204, description: 'TOTP successfully removed' })
  async disableTotp(@CurrentUser() user: AuthenticatedUser): Promise<void> {
    await this.adminService.disableTotp(user.sub);
  }

  @Get('profile')
  @ApiOperation({ summary: 'Get full profile from Keycloak + avatar from DB' })
  async getProfile(@CurrentUser() user: AuthenticatedUser) {
    const [kc, dbUser] = await Promise.all([
      this.adminService.getUser(user.sub),
      this.userRepo.findOne({ where: { id: user.sub } }),
    ]);
    return {
      sub: user.sub,
      username: kc.username,
      email: kc.email,
      firstName: kc.firstName ?? '',
      lastName: kc.lastName ?? '',
      avatarUrl: dbUser?.avatarUrl ?? null,
    };
  }

  @Post('avatar')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Upload avatar as base64 data URL' })
  async uploadAvatar(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UploadAvatarDto,
  ): Promise<{ ok: boolean }> {
    if (dto.avatarUrl.length > 600_000) {
      throw new BadRequestException('Image too large — max ~450 KB');
    }
    await this.userRepo.update({ id: user.sub }, { avatarUrl: dto.avatarUrl });
    return { ok: true };
  }

  @Delete('avatar')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove avatar' })
  async deleteAvatar(@CurrentUser() user: AuthenticatedUser): Promise<void> {
    await this.userRepo.update({ id: user.sub }, { avatarUrl: null });
  }

  @Patch('profile')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update firstName / lastName in Keycloak' })
  async updateProfile(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateProfileDto,
  ): Promise<{ ok: boolean }> {
    await this.adminService.updateUserProfile(user.sub, dto);
    return { ok: true };
  }

  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Change password — verifies current password first' })
  async changePassword(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: ChangePasswordDto,
  ): Promise<{ ok: boolean }> {
    if (dto.newPassword === dto.currentPassword) {
      throw new BadRequestException('New password must differ from current password');
    }
    const valid = await this.adminService.verifyPassword(user.preferred_username, dto.currentPassword);
    if (!valid) {
      throw new UnauthorizedException('Current password is incorrect');
    }
    await this.adminService.resetPassword(user.sub, dto.newPassword);
    return { ok: true };
  }

  @Public()
  @Post('introspect')
  @ApiOperation({ summary: 'Introspect a token — checks validity via Keycloak (public)' })
  @ApiResponse({ status: 200, description: 'Token introspection result' })
  async introspect(@Body() dto: IntrospectTokenDto): Promise<TokenIntrospection> {
    return this.adminService.introspectToken(dto.token);
  }
}

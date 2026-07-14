import { Controller, Get, Delete, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';
import { CurrentUser } from '@shared/decorators/current-user.decorator';
import { Public } from '@shared/decorators/public.decorator';
import { AuthenticatedUser } from '../interfaces/authenticated-user.interface';
import { KeycloakAdminService, TokenIntrospection } from '../infrastructure/keycloak-admin.service';

class IntrospectTokenDto {
  @ApiProperty({ description: 'JWT access token to validate' })
  @IsString()
  @IsNotEmpty()
  token!: string;
}

@ApiTags('auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly adminService: KeycloakAdminService) {}

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

  @Delete('2fa')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Disable TOTP for the current user via Keycloak Admin API' })
  @ApiResponse({ status: 204, description: 'TOTP successfully removed' })
  async disableTotp(@CurrentUser() user: AuthenticatedUser): Promise<void> {
    await this.adminService.disableTotp(user.sub);
  }

  @Public()
  @Post('introspect')
  @ApiOperation({ summary: 'Introspect a token — checks validity via Keycloak (public)' })
  @ApiResponse({ status: 200, description: 'Token introspection result' })
  async introspect(@Body() dto: IntrospectTokenDto): Promise<TokenIntrospection> {
    return this.adminService.introspectToken(dto.token);
  }
}

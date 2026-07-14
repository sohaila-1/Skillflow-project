import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { KeycloakJwtStrategy } from './strategies/keycloak-jwt.strategy';
import { KeycloakAdminService } from './infrastructure/keycloak-admin.service';
import { AuthController } from './presentation/auth.controller';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [AuthController],
  providers: [KeycloakJwtStrategy, KeycloakAdminService],
  exports: [PassportModule, KeycloakAdminService],
})
export class AuthModule {}

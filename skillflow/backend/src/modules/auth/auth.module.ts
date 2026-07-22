import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KeycloakJwtStrategy } from './strategies/keycloak-jwt.strategy';
import { KeycloakAdminService } from './infrastructure/keycloak-admin.service';
import { AuthController } from './presentation/auth.controller';
import { AdminController } from './presentation/admin.controller';
import { User } from '@modules/users/domain/user.entity';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' }), TypeOrmModule.forFeature([User])],
  controllers: [AuthController, AdminController],
  providers: [KeycloakJwtStrategy, KeycloakAdminService],
  exports: [PassportModule, KeycloakAdminService],
})
export class AuthModule {}

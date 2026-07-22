import { Controller, Get, Post, Delete, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '@shared/decorators/roles.decorator';
import { KeycloakAdminService } from '../infrastructure/keycloak-admin.service';

@ApiTags('admin')
@ApiBearerAuth()
@Controller('admin')
@Roles('admin')
export class AdminController {
  constructor(private readonly keycloakAdmin: KeycloakAdminService) {}

  @Get('users')
  async listUsers() {
    const users = await this.keycloakAdmin.listUsers();
    const withRoles = await Promise.all(
      users.map(async (u) => {
        const roles = await this.keycloakAdmin.getUserRealmRoles(u.id);
        return {
          id: u.id,
          username: u.username,
          email: u.email,
          firstName: u.firstName,
          lastName: u.lastName,
          enabled: u.enabled,
          roles: roles.map((r) => r.name).filter((n) => !n.startsWith('default-')),
        };
      }),
    );
    return withRoles;
  }

  @Post('users/:id/roles/:role')
  @HttpCode(HttpStatus.NO_CONTENT)
  async assignRole(@Param('id') userId: string, @Param('role') role: string) {
    await this.keycloakAdmin.assignRealmRole(userId, role);
  }

  @Delete('users/:id/roles/:role')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeRole(@Param('id') userId: string, @Param('role') role: string) {
    await this.keycloakAdmin.removeRealmRole(userId, role);
  }
}

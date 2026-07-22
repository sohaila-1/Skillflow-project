import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface CachedToken {
  access_token: string;
  expires_at: number;
}

export interface KeycloakUser {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  enabled: boolean;
  emailVerified: boolean;
  attributes?: Record<string, string[]>;
}

export interface TokenIntrospection {
  active: boolean;
  sub?: string;
  email?: string;
  preferred_username?: string;
  exp?: number;
  iat?: number;
}

@Injectable()
export class KeycloakAdminService {
  private readonly logger = new Logger(KeycloakAdminService.name);
  private readonly keycloakUrl: string;
  private readonly realm: string;
  private readonly adminUsername: string;
  private readonly adminPassword: string;
  private readonly clientId: string;
  private readonly clientSecret: string;
  private cachedToken: CachedToken | null = null;

  constructor(private readonly config: ConfigService) {
    this.keycloakUrl = config.getOrThrow<string>('KEYCLOAK_URL');
    this.realm = config.getOrThrow<string>('KEYCLOAK_REALM');
    this.adminUsername = config.get<string>('KEYCLOAK_ADMIN_USERNAME', 'admin')!;
    this.adminPassword = config.get<string>('KEYCLOAK_ADMIN_PASSWORD', 'admin')!;
    this.clientId = config.getOrThrow<string>('KEYCLOAK_CLIENT_ID');
    this.clientSecret = config.getOrThrow<string>('KEYCLOAK_CLIENT_SECRET');
  }

  private async getAdminToken(): Promise<string> {
    if (this.cachedToken && Date.now() < this.cachedToken.expires_at - 15_000) {
      return this.cachedToken.access_token;
    }

    const url = `${this.keycloakUrl}/realms/master/protocol/openid-connect/token`;
    const body = new URLSearchParams({
      grant_type: 'password',
      client_id: 'admin-cli',
      username: this.adminUsername,
      password: this.adminPassword,
    });

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });

    if (!res.ok) {
      const text = await res.text();
      this.logger.error(`Admin token request failed: ${res.status} — ${text}`);
      throw new InternalServerErrorException('Keycloak admin authentication failed');
    }

    const data = (await res.json()) as { access_token: string; expires_in: number };
    this.cachedToken = {
      access_token: data.access_token,
      expires_at: Date.now() + data.expires_in * 1000,
    };
    return this.cachedToken.access_token;
  }

  private async adminFetch(path: string, options: RequestInit = {}): Promise<Response> {
    const token = await this.getAdminToken();
    const url = `${this.keycloakUrl}/admin/realms/${this.realm}${path}`;
    return fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...((options.headers as Record<string, string>) ?? {}),
      },
    });
  }

  async getUser(userId: string): Promise<KeycloakUser> {
    const res = await this.adminFetch(`/users/${userId}`);
    if (!res.ok) {
      throw new InternalServerErrorException('Failed to fetch user from Keycloak');
    }
    return res.json() as Promise<KeycloakUser>;
  }

  async isTotpEnabled(userId: string): Promise<boolean> {
    const res = await this.adminFetch(`/users/${userId}/credentials`);
    if (!res.ok) {
      throw new InternalServerErrorException('Failed to fetch user credentials');
    }
    const credentials = (await res.json()) as Array<{ id: string; type: string }>;
    return credentials.some((c) => c.type === 'otp');
  }

  async disableTotp(userId: string): Promise<void> {
    const res = await this.adminFetch(`/users/${userId}/credentials`);
    if (!res.ok) {
      throw new InternalServerErrorException('Failed to fetch user credentials');
    }
    const credentials = (await res.json()) as Array<{ id: string; type: string }>;
    const otpCredentials = credentials.filter((c) => c.type === 'otp');

    for (const cred of otpCredentials) {
      const delRes = await this.adminFetch(`/users/${userId}/credentials/${cred.id}`, {
        method: 'DELETE',
      });
      if (!delRes.ok) {
        throw new InternalServerErrorException('Failed to remove TOTP credential');
      }
    }
  }

  async sendPasswordResetEmail(userId: string): Promise<void> {
    const res = await this.adminFetch(`/users/${userId}/execute-actions-email`, {
      method: 'PUT',
      body: JSON.stringify(['UPDATE_PASSWORD']),
    });
    if (!res.ok) {
      const text = await res.text();
      this.logger.error(`Password reset email failed: ${res.status} — ${text}`);
      throw new InternalServerErrorException('Failed to send password reset email');
    }
  }

  async listUsers(max = 100): Promise<KeycloakUser[]> {
    const res = await this.adminFetch(`/users?max=${max}`);
    if (!res.ok) throw new InternalServerErrorException('Failed to list users from Keycloak');
    return res.json() as Promise<KeycloakUser[]>;
  }

  async getRealmRole(roleName: string): Promise<{ id: string; name: string } | null> {
    const res = await this.adminFetch(`/roles/${encodeURIComponent(roleName)}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new InternalServerErrorException(`Failed to get role ${roleName}`);
    return res.json() as Promise<{ id: string; name: string }>;
  }

  async ensureRealmRole(roleName: string): Promise<{ id: string; name: string }> {
    const existing = await this.getRealmRole(roleName);
    if (existing) return existing;
    const createRes = await this.adminFetch('/roles', {
      method: 'POST',
      body: JSON.stringify({ name: roleName }),
    });
    if (!createRes.ok && createRes.status !== 409) {
      throw new InternalServerErrorException(`Failed to create role ${roleName}`);
    }
    return (await this.getRealmRole(roleName))!;
  }

  async getUserRealmRoles(userId: string): Promise<{ id: string; name: string }[]> {
    const res = await this.adminFetch(`/users/${userId}/role-mappings/realm`);
    if (!res.ok) throw new InternalServerErrorException('Failed to get user roles');
    return res.json() as Promise<{ id: string; name: string }[]>;
  }

  async assignRealmRole(userId: string, roleName: string): Promise<void> {
    const role = await this.ensureRealmRole(roleName);
    const res = await this.adminFetch(`/users/${userId}/role-mappings/realm`, {
      method: 'POST',
      body: JSON.stringify([role]),
    });
    if (!res.ok) throw new InternalServerErrorException(`Failed to assign role ${roleName}`);
  }

  async removeRealmRole(userId: string, roleName: string): Promise<void> {
    const role = await this.getRealmRole(roleName);
    if (!role) return;
    const res = await this.adminFetch(`/users/${userId}/role-mappings/realm`, {
      method: 'DELETE',
      body: JSON.stringify([role]),
    });
    if (!res.ok) throw new InternalServerErrorException(`Failed to remove role ${roleName}`);
  }

  async updateUserProfile(
    userId: string,
    updates: { firstName?: string; lastName?: string },
  ): Promise<void> {
    const res = await this.adminFetch(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    if (!res.ok) {
      const text = await res.text();
      this.logger.error(`Update user profile failed: ${res.status} — ${text}`);
      throw new InternalServerErrorException('Failed to update profile');
    }
  }

  async verifyPassword(username: string, password: string): Promise<boolean> {
    const url = `${this.keycloakUrl}/realms/${this.realm}/protocol/openid-connect/token`;
    const body = new URLSearchParams({
      grant_type: 'password',
      client_id: this.clientId,
      client_secret: this.clientSecret,
      username,
      password,
    });
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });
    return res.ok;
  }

  async resetPassword(userId: string, newPassword: string): Promise<void> {
    const res = await this.adminFetch(`/users/${userId}/reset-password`, {
      method: 'PUT',
      body: JSON.stringify({ type: 'password', value: newPassword, temporary: false }),
    });
    if (!res.ok) {
      const text = await res.text();
      this.logger.error(`Reset password failed: ${res.status} — ${text}`);
      throw new InternalServerErrorException('Failed to reset password');
    }
  }

  async introspectToken(token: string): Promise<TokenIntrospection> {
    const url = `${this.keycloakUrl}/realms/${this.realm}/protocol/openid-connect/token/introspect`;
    const body = new URLSearchParams({
      token,
      client_id: this.clientId,
      client_secret: this.clientSecret,
    });

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });

    if (!res.ok) {
      throw new InternalServerErrorException('Token introspection failed');
    }
    return res.json() as Promise<TokenIntrospection>;
  }
}

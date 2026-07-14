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

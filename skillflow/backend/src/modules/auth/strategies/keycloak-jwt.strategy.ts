import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';
import { AuthenticatedUser } from '../interfaces/authenticated-user.interface';

/** Forme brute du payload JWT émis par Keycloak */
interface KeycloakJwtPayload {
  sub: string;
  email: string;
  preferred_username: string;
  realm_access?: { roles?: string[] };
}

@Injectable()
export class KeycloakJwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService) {
    const keycloakUrl = config.getOrThrow<string>('KEYCLOAK_URL');
    const realm = config.getOrThrow<string>('KEYCLOAK_REALM');

    super({
      // jwks-rsa va chercher la clé publique Keycloak à la volée (RS256)
      // et la met en cache pour éviter d'appeler Keycloak à chaque requête
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 10,
        jwksUri: `${keycloakUrl}/realms/${realm}/protocol/openid-connect/certs`,
      }),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      algorithms: ['RS256'],
      issuer: `${keycloakUrl}/realms/${realm}`,
    });
  }

  /** Appelé après validation de la signature — retourne req.user */
  validate(payload: KeycloakJwtPayload): AuthenticatedUser {
    return {
      sub: payload.sub,
      email: payload.email,
      preferred_username: payload.preferred_username,
      roles: payload.realm_access?.roles ?? [],
    };
  }
}

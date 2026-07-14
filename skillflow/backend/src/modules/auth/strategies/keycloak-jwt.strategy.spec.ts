// jwks-rsa est en ESM — on le mocke pour isoler notre logique de validate()
jest.mock('jwks-rsa', () => ({
  passportJwtSecret: jest.fn().mockReturnValue(jest.fn()),
}));

import { ConfigService } from '@nestjs/config';
import { KeycloakJwtStrategy } from './keycloak-jwt.strategy';

// On mock ConfigService pour éviter de dépendre de variables d'env dans les tests
const mockConfig = {
  getOrThrow: (key: string) => {
    const values: Record<string, string> = {
      KEYCLOAK_URL: 'http://keycloak:8080',
      KEYCLOAK_REALM: 'skillflow',
    };
    return values[key];
  },
} as unknown as ConfigService;

describe('KeycloakJwtStrategy', () => {
  let strategy: KeycloakJwtStrategy;

  beforeEach(() => {
    strategy = new KeycloakJwtStrategy(mockConfig);
  });

  describe('validate()', () => {
    it('extrait correctement les champs du payload JWT', () => {
      const payload = {
        sub: 'abc-123',
        email: 'alice@example.com',
        preferred_username: 'alice',
        realm_access: { roles: ['student'] },
      };

      const result = strategy.validate(payload);

      expect(result).toEqual({
        sub: 'abc-123',
        email: 'alice@example.com',
        preferred_username: 'alice',
        roles: ['student'],
      });
    });

    it('retourne un tableau vide si realm_access est absent', () => {
      const payload = {
        sub: 'xyz-456',
        email: 'bob@example.com',
        preferred_username: 'bob',
      };

      const result = strategy.validate(payload);

      expect(result.roles).toEqual([]);
    });

    it('gère le cas où realm_access.roles est undefined', () => {
      const payload = {
        sub: 'xyz-789',
        email: 'carol@example.com',
        preferred_username: 'carol',
        realm_access: {},
      };

      const result = strategy.validate(payload);

      expect(result.roles).toEqual([]);
    });
  });
});

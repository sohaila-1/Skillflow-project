import { SyncUserUseCase } from './sync-user.use-case';
import { UserRepositoryPort } from '../domain/user.repository.port';
import { User } from '../domain/user.entity';
import { AuthenticatedUser } from '@modules/auth/interfaces/authenticated-user.interface';

const mockRepo: jest.Mocked<UserRepositoryPort> = {
  sync: jest.fn(),
};

const authUser: AuthenticatedUser = {
  sub: 'keycloak-uuid',
  email: 'alice@example.com',
  preferred_username: 'alice',
  roles: ['student'],
};

describe('SyncUserUseCase', () => {
  let useCase: SyncUserUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new SyncUserUseCase(mockRepo);
  });

  it('delegates to the repository with mapped fields', async () => {
    const saved = Object.assign(new User(), {
      id: 'keycloak-uuid',
      email: 'alice@example.com',
      username: 'alice',
      displayName: 'alice',
      roles: ['student'],
    });
    mockRepo.sync.mockResolvedValue(saved);

    const result = await useCase.execute(authUser);

    expect(mockRepo.sync).toHaveBeenCalledWith({
      id: 'keycloak-uuid',
      email: 'alice@example.com',
      username: 'alice',
      displayName: 'alice',
      roles: ['student'],
    });
    expect(result).toBe(saved);
  });

  it('returns the synced user entity', async () => {
    const saved = Object.assign(new User(), { id: 'keycloak-uuid' });
    mockRepo.sync.mockResolvedValue(saved);

    const result = await useCase.execute(authUser);

    expect(result.id).toBe('keycloak-uuid');
  });
});

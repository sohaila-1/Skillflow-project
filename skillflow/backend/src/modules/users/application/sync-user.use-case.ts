import { Inject, Injectable } from '@nestjs/common';
import { User } from '../domain/user.entity';
import { UserRepositoryPort, USER_REPOSITORY } from '../domain/user.repository.port';
import { AuthenticatedUser } from '@modules/auth/interfaces/authenticated-user.interface';

@Injectable()
export class SyncUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly repo: UserRepositoryPort,
  ) {}

  execute(auth: AuthenticatedUser): Promise<User> {
    return this.repo.sync({
      id: auth.sub,
      email: auth.email,
      username: auth.preferred_username,
      displayName: auth.preferred_username,
      roles: auth.roles,
    });
  }
}

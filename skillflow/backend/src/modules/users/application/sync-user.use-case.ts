import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../domain/user.entity';
import { AuthenticatedUser } from '@modules/auth/interfaces/authenticated-user.interface';

@Injectable()
export class SyncUserUseCase {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
  ) {}

  async execute(auth: AuthenticatedUser): Promise<User> {
    await this.repo.upsert(
      {
        id: auth.sub,
        email: auth.email,
        username: auth.preferred_username,
        displayName: auth.preferred_username,
        roles: auth.roles,
      },
      { conflictPaths: ['id'], skipUpdateIfNoValuesChanged: true },
    );
    return this.repo.findOneOrFail({ where: { id: auth.sub } });
  }
}

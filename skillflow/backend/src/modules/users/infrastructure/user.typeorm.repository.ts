import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../domain/user.entity';
import { UserRepositoryPort } from '../domain/user.repository.port';

@Injectable()
export class UserTypeOrmRepository implements UserRepositoryPort {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  async sync(data: {
    id: string;
    email: string;
    username: string;
    displayName: string;
    roles: string[];
  }): Promise<User> {
    await this.repo.upsert(data, {
      conflictPaths: ['id'],
      skipUpdateIfNoValuesChanged: true,
    });
    return this.repo.findOneOrFail({ where: { id: data.id } });
  }
}

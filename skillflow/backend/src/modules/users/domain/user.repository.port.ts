import { User } from './user.entity';

export interface UserRepositoryPort {
  sync(data: {
    id: string;
    email: string;
    username: string;
    displayName: string;
    roles: string[];
  }): Promise<User>;
}

export const USER_REPOSITORY = Symbol('UserRepositoryPort');

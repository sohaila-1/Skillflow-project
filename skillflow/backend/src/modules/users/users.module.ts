import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/user.entity';
import { USER_REPOSITORY } from './domain/user.repository.port';
import { UserTypeOrmRepository } from './infrastructure/user.typeorm.repository';
import { SyncUserUseCase } from './application/sync-user.use-case';
import { UsersController } from './presentation/users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [
    SyncUserUseCase,
    {
      provide: USER_REPOSITORY,
      useClass: UserTypeOrmRepository,
    },
  ],
  exports: [SyncUserUseCase],
})
export class UsersModule {}

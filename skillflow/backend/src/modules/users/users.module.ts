import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/user.entity';
import { SyncUserUseCase } from './application/sync-user.use-case';
import { UsersController } from './presentation/users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [SyncUserUseCase],
  exports: [SyncUserUseCase],
})
export class UsersModule {}

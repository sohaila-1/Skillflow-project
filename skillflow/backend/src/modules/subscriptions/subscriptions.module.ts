import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from './domain/subscription.entity';
import { SUBSCRIPTION_REPOSITORY } from './domain/subscription.repository.port';
import { SubscriptionTypeOrmRepository } from './infrastructure/subscription.typeorm.repository';
import { ActivateSubscriptionUseCase } from './application/activate-subscription.use-case';
import { GetMySubscriptionUseCase } from './application/get-my-subscription.use-case';
import { SubscriptionsController } from './presentation/subscriptions.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Subscription])],
  controllers: [SubscriptionsController],
  providers: [
    ActivateSubscriptionUseCase,
    GetMySubscriptionUseCase,
    { provide: SUBSCRIPTION_REPOSITORY, useClass: SubscriptionTypeOrmRepository },
  ],
  exports: [GetMySubscriptionUseCase],
})
export class SubscriptionsModule {}

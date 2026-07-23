import { Inject, Injectable } from '@nestjs/common';
import { Subscription } from '../domain/subscription.entity';
import { SubscriptionRepositoryPort, SUBSCRIPTION_REPOSITORY } from '../domain/subscription.repository.port';

@Injectable()
export class GetMySubscriptionUseCase {
  constructor(
    @Inject(SUBSCRIPTION_REPOSITORY)
    private readonly repo: SubscriptionRepositoryPort,
  ) {}

  async execute(userId: string): Promise<Subscription | null> {
    return this.repo.findActiveByUserId(userId);
  }
}

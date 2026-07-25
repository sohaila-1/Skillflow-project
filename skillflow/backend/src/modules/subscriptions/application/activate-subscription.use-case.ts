import { Inject, Injectable } from '@nestjs/common';
import { Subscription } from '../domain/subscription.entity';
import { SubscriptionRepositoryPort, SUBSCRIPTION_REPOSITORY } from '../domain/subscription.repository.port';

const SUBSCRIPTION_DAYS = 30;

@Injectable()
export class ActivateSubscriptionUseCase {
  constructor(
    @Inject(SUBSCRIPTION_REPOSITORY)
    private readonly repo: SubscriptionRepositoryPort,
  ) {}

  async execute(userId: string): Promise<Subscription> {
    const existing = await this.repo.findByUserId(userId);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + SUBSCRIPTION_DAYS);

    if (existing) {
      existing.status = 'active';
      existing.expiresAt = expiresAt;
      return this.repo.save(existing);
    }

    return this.repo.save({ userId, status: 'active', expiresAt });
  }
}

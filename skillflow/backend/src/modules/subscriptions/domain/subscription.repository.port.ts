import { Subscription } from './subscription.entity';

export interface SubscriptionRepositoryPort {
  findActiveByUserId(userId: string): Promise<Subscription | null>;
  findByUserId(userId: string): Promise<Subscription | null>;
  save(data: Partial<Subscription>): Promise<Subscription>;
}

export const SUBSCRIPTION_REPOSITORY = Symbol('SubscriptionRepositoryPort');

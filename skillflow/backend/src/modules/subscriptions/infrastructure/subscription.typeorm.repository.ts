import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { Subscription } from '../domain/subscription.entity';
import { SubscriptionRepositoryPort } from '../domain/subscription.repository.port';

@Injectable()
export class SubscriptionTypeOrmRepository implements SubscriptionRepositoryPort {
  constructor(
    @InjectRepository(Subscription)
    private readonly repo: Repository<Subscription>,
  ) {}

  findActiveByUserId(userId: string): Promise<Subscription | null> {
    return this.repo.findOne({
      where: { userId, status: 'active', expiresAt: MoreThan(new Date()) },
    });
  }

  findByUserId(userId: string): Promise<Subscription | null> {
    return this.repo.findOne({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async save(data: Partial<Subscription>): Promise<Subscription> {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }
}

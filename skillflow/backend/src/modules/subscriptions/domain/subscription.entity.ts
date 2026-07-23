import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export type SubscriptionStatus = 'active' | 'cancelled';

@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id' })
  userId!: string;

  @Column({ length: 20, default: 'active' })
  status!: SubscriptionStatus;

  @Column({ name: 'expires_at', type: 'timestamptz' })
  expiresAt!: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  get isActive(): boolean {
    return this.status === 'active' && this.expiresAt > new Date();
  }
}

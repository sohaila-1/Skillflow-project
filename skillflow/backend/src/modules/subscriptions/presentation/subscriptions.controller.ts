import { Controller, Get, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ActivateSubscriptionUseCase } from '../application/activate-subscription.use-case';
import { GetMySubscriptionUseCase } from '../application/get-my-subscription.use-case';
import { CurrentUser } from '@shared/decorators/current-user.decorator';
import { AuthenticatedUser } from '@modules/auth/interfaces/authenticated-user.interface';

@ApiTags('subscriptions')
@ApiBearerAuth()
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(
    private readonly activate: ActivateSubscriptionUseCase,
    private readonly getMy: GetMySubscriptionUseCase,
  ) {}

  @Get('me')
  async getMySubscription(@CurrentUser() user: AuthenticatedUser) {
    const sub = await this.getMy.execute(user.sub);
    return {
      isActive: sub?.isActive ?? false,
      expiresAt: sub?.expiresAt ?? null,
      plan: sub?.isActive ? 'premium' : 'free',
    };
  }

  @Post('activate')
  @HttpCode(HttpStatus.OK)
  async activateSubscription(@CurrentUser() user: AuthenticatedUser) {
    const sub = await this.activate.execute(user.sub);
    return {
      isActive: sub.isActive,
      expiresAt: sub.expiresAt,
      plan: 'premium',
      message: 'Premium activated! Enjoy unlimited access for 30 days.',
    };
  }
}

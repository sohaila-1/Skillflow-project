import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { AuthenticatedUser } from '../../modules/auth/interfaces/authenticated-user.interface';

/** Injecte l'utilisateur authentifié extrait du JWT dans un paramètre de controller */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthenticatedUser => {
    const req = ctx.switchToHttp().getRequest<Request & { user: AuthenticatedUser }>();
    return req.user;
  },
);

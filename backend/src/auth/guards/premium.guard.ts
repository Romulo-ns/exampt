import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

/**
 * Guard that restricts access to Premium-only endpoints.
 * Must be used AFTER JwtAuthGuard so that req.user is populated.
 *
 * Usage: @UseGuards(JwtAuthGuard, PremiumGuard)
 */
@Injectable()
export class PremiumGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || user.plan !== 'PREMIUM') {
      throw new ForbiddenException(
        'Esta funcionalidade é exclusiva para utilizadores Premium.',
      );
    }

    return true;
  }
}

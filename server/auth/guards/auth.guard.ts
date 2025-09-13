import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const isAuthenticated = request.session.userId;

    if (!isAuthenticated) {
      throw new UnauthorizedException('User is not authenticated');
    }

    return true;
  }
}

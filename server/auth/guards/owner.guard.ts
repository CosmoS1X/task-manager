import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class OwnerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const userIdFromSession = request.session.userId;
    const userIdFromParams = Number(request.params.id);

    if (userIdFromSession !== userIdFromParams) {
      throw new ForbiddenException('You can only modify your own profile');
    }

    return true;
  }
}

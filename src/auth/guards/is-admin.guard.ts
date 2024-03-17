import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_ADMIN_KEY } from '../../common/decorators/is-admin.decorator';
import { UserEntity } from '../../users/entities/user.entity';

@Injectable()
export class IsAdminGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isAdmin = this.reflector.get<boolean>(
      IS_ADMIN_KEY,
      context.getHandler(),
    );
    if (!isAdmin) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user: UserEntity = request.user;

    return !!(user && user.isAdmin);
  }
}

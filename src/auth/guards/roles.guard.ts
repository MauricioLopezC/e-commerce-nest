import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (user) {
      this.logger.log(
        `User ${user.email} (ID: ${user.id}) with Role: ${user.role} is accessing a protected route`,
      );
    }

    const hasRole = requiredRoles.some((role: string) => user.role === role);

    if (!hasRole) {
      this.logger.warn(
        `Access denied for User ${user?.email}. Required roles: [${requiredRoles}]`,
      );
    }

    return hasRole;
  }
}

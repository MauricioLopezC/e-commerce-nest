import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class OwnGuard implements CanActivate {
  /**
   * This guard prevents a user from accessing resources that are not associated with their id
   * for example user 1 cannot access favorites of user 2
   */
  canActivate(context: ExecutionContext): boolean {
    const { user, params } = context.switchToHttp().getRequest();
    return user.id === Number(params.userId);
  }
}

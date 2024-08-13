import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {

  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride(ROLES_KEY, [
      context.getHandler(),
      context.getClass()
    ])

    console.log("ROLEs => ", requiredRoles)

    if (!requiredRoles) {
      return true
    }

    //in the AuthGuard, We assign the payload to the request object
    const { user } = context.switchToHttp().getRequest()
    console.log('USER==>', user)
    return requiredRoles.some((role: string) => user.role === role)
  }
}

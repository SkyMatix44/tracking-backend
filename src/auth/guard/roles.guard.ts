import { Role } from '@prisma/client';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<Role[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return this.matchRoles(roles, user.role);
  }

  // Compare role of User with roles of Guard
  matchRoles (roles: Role[], userRole: Role): boolean {
    let isNotValid : boolean = false;
    for (var role of roles){
      if (role === userRole){
        return true;
      }
    }
    return isNotValid;
  }
}
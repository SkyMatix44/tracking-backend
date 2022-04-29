import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { TrackingRequest } from '../middleware/auth.middleware';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<Role[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request: TrackingRequest = context.switchToHttp().getRequest();
    const userRole = request.userRole;
    return this.matchRoles(roles, userRole);
  }

  // Compare role of User with roles of Guard
  matchRoles(roles: Role[], userRole: Role): boolean {
    return roles.some((role) => role == userRole);
  }
}

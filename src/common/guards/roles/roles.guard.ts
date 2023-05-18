import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { User } from '../../../user/entities/user.entity';

import { Role } from '../../../user/enums/role.enum';

import { ROLES_KEY } from '../../constants/roles.constant';
import { IRoleOptions } from '../../interfaces/role-options.interface';

/**
 * A guard that checks if the user has the required roles to access a
 * resource.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly _reflector: Reflector) {}

  /**
   * Determines if the user has the required roles to access the resource.
   *
   * @param context The execution context of the current request.
   * @returns a boolean that indicates if the user has permission to access
   * the resource.
   * @throws ForbiddenException if the user does not have permission to
   * access the resource.
   */
  canActivate(context: ExecutionContext) {
    const user = context.switchToHttp().getRequest().user as User;
    const options = this._reflector.get<IRoleOptions>(
      ROLES_KEY,
      context.getHandler(),
    );

    if (!user || !options) {
      this._throwForbiddenException();
    }

    let hasRole: boolean;

    if (Role.isRole(options.roles)) {
      const role = options.roles;
      hasRole = user.hasRole(role);
    } else if (Array.isArray(options.roles)) {
      const roles = options.roles;
      hasRole = roles.some((role) => user.hasRole(role));
    } else {
      const regex = new RegExp(options.roles);
      hasRole = user.roles.some((role) => regex.test(role));
    }

    switch (options.type) {
      case 'allow':
        if (hasRole) {
          return true;
        }
        this._throwForbiddenException();
      case 'deny':
        if (hasRole) {
          this._throwForbiddenException();
        }
        return true;
    }
  }

  /**
   * Throws a forbidden exception.
   */
  private _throwForbiddenException() {
    throw new ForbiddenException(
      'You do not have permission to access this resource',
    );
  }
}

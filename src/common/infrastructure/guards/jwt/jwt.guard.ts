import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

import { Role } from '../../../../user/domain/models/role.enum';
import { User } from '../../../../user/domain/models/user';

import { IS_PUBLIC } from '../../../domain/constants/public.constant';

/**
 * Guard responsible for protecting routes using the jwt strategy.
 */
@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  /**
   * Deals with the error or the user.
   *
   * @param error An object that represents the current JWT error.
   * @param user The user the is making the request.
   * @returns the if valid.
   */
  handleRequest<TUser = User>(
    _: null,
    user: TUser,
    _error: Error,
    context: ExecutionContext,
  ) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (user) {
      return user;
    }

    const token = this._getAuthorizationToken(context);

    if (isPublic && !token) {
      return new User({
        name: null,
        username: null,
        password: null,
        email: null,
        roles: new Set([Role.guest]),
      });
    }

    throw new UnauthorizedException('Invalid or missing authentication token');
  }

  /**
   * Returns the authorization token.
   *
   * @param context The request context.
   * @returns the authorization token.
   */
  private _getAuthorizationToken(context: ExecutionContext) {
    const token = (context.switchToHttp().getRequest() as Request).headers[
      'authorization'
    ];
    return token ? token.replace('Bearer', '').trim() : '';
  }
}

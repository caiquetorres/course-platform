import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { User } from '../../user/entities/user.entity';

import { AuthService } from '../auth.service';

import { Strategy } from 'passport-local';

/**
 * Implements local authentication strategy using Passport.js.
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly _authService: AuthService) {
    super();
  }

  /**
   * Validates a user's username and password.
   *
   * @param username The user's username.
   * @param password The user's password.
   * @returns the user, if the username and password are valid.
   * @throws {UnauthorizedException} If the provided credentials are
   * invalid.
   */
  async validate(username: string, password: string): Promise<User> {
    return this._authService.validateByUsernameAndPassword(username, password);
  }
}

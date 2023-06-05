import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { User } from '../../../user/domain/models/user';

import { AuthService } from '../services/auth.service';

import { InvalidUsernameOrPassword } from '../../domain/errors/invalid-username-or-password.error';
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
    const result = await this._authService.validateByUsernameAndPassword(
      username,
      password,
    );

    if (result.isRight()) {
      return result.value;
    }

    if (result.value instanceof InvalidUsernameOrPassword) {
      throw new UnauthorizedException(result.value.message);
    }

    throw new InternalServerErrorException(
      'An issue occurred during login. If the error persists, please contact the administrators.',
    );
  }
}

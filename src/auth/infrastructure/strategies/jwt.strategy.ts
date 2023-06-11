import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { User } from '../../../user/domain/models/user';

import { EnvService } from '../../../env/env.service';
import { AuthService } from '../services/auth.service';

import { InvalidOrMissingToken } from '../../domain/errors/invalid-or-missing-token';
import { IIdentifier } from '../../domain/interfaces/identifier.interface';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';

/**
 * Implements JSON Web Token (JWT) authentication strategy using
 * Passport.js.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    _envService: EnvService,
    private readonly _authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: _envService.get('JWT_SECRET'),
      expiresIn: _envService.get('JWT_EXPIRES_IN'),
    } as StrategyOptions);
  }

  /**
   * Validates a user's.
   *
   * @param identifier The user's identifier object containing the id
   * property.
   * @returns the user, if the username and password are valid.
   * @throws {UnauthorizedException} If the provided credentials are
   * invalid.
   */
  async validate(identifier: IIdentifier): Promise<User> {
    const result = await this._authService.validateById(identifier.id);

    if (result.isRight()) {
      return result.value;
    }

    if (result instanceof InvalidOrMissingToken) {
      throw new UnauthorizedException(result.value.message);
    }

    throw new InternalServerErrorException(
      'An issue occurred during token validation. If the error persists, please contact the administrators.',
    );
  }
}

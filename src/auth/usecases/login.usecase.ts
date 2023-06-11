import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { User } from '../../user/domain/models/user';

import { EnvService } from '../../env/env.service';

/**
 * Use case for user login.
 */
@Injectable()
export class LoginUseCase {
  constructor(
    private readonly _envService: EnvService,
    private readonly _jwtService: JwtService,
  ) {}

  /**
   * Performs user login with the provided user object.
   *
   * @param user The user object containing login credentials.
   * @returns A promise that resolves to an authentication token upon
   * successful login.
   */
  async login(user: User) {
    const expiresIn = this._envService.get('JWT_EXPIRES_IN');
    const { id, username } = user;
    const token = await this._jwtService.signAsync(
      { id, username },
      { expiresIn },
    );
    return { token, expiresIn };
  }
}

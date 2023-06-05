import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { User } from '../../user/domain/models/user';

import { EnvService } from '../../env/env.service';

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly _envService: EnvService,
    private readonly _jwtService: JwtService,
  ) {}

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

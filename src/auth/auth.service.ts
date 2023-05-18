import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../user/entities/user.entity';

import { TokenDto } from './dtos/token.dto';

import { EnvService } from '../env/env.service';

import bcryptjs from 'bcryptjs';

/**
 * Class responsible for managing authentication for users.
 */
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly _userRepository: Repository<User>,
    private readonly _envService: EnvService,
    private readonly _jwtService: JwtService,
  ) {}

  /**
   * Generates a JWT for a user.
   *
   * @param user The user for whom the JWT is being generated.
   * @returns an object containing the JWT and its expiration date.
   */
  async login(user: User): Promise<TokenDto> {
    const expiresIn = this._envService.get('JWT_EXPIRES_IN');
    const { id, username } = user;
    const token = await this._jwtService.signAsync(
      { id, username },
      { expiresIn },
    );
    return { token, expiresIn };
  }

  /**
   * Validates a user's credentials.
   *
   * @param username The user's username.
   * @param password The user's password.
   * @returns the user if the credentials are valid, or null if they are
   * not.
   */
  async validateByUsernameAndPassword(username: string, password: string) {
    const user = await this._userRepository.findOne({
      where: [{ username }, { email: username }],
    });

    if (!user) {
      throw new UnauthorizedException(
        'Invalid username or password. Please check your credentials and try again',
      );
    }

    const passwordMatches = await bcryptjs.compare(password, user.password);

    if (!passwordMatches) {
      throw new UnauthorizedException(
        'Invalid username or password. Please check your credentials and try again',
      );
    }

    return user;
  }

  /**
   * Validates a user's JWT.
   *
   * @param id The ID of the user to validate.
   * @returns the user if the credentials are valid, or null if they are
   * not.
   */
  async validateById(id: string): Promise<User> {
    const user = await this._userRepository.findOneBy({ id });

    if (!user) {
      throw new UnauthorizedException(`The informed token is no longer valid`);
    }

    return user;
  }
}

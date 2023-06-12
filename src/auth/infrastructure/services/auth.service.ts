import { Injectable } from '@nestjs/common';

import { User } from '../../../user/domain/models/user';

import { Either, Left, Right } from '../../../common/domain/classes/either';
import { UserRepository } from '../../../user/infrastructure/repositories/user.repository';
import { InvalidUsernameOrPassword } from '../../domain/errors/invalid-username-or-password.error';
import bcryptjs from 'bcryptjs';

/**
 * Class responsible for managing authentication for users.
 */
@Injectable()
export class AuthService {
  constructor(private readonly _userRepository: UserRepository) {}

  /**
   * Validates a user's credentials.
   *
   * @param username The user's username.
   * @param password The user's password.
   * @returns the user if the credentials are valid, or null if they are
   * not.
   */
  async validateByUsernameAndPassword(
    username: string,
    password: string,
  ): Promise<Either<Error, User>> {
    const user = await this._userRepository.findOneByUsernameOrEmail(username);

    if (!user) {
      return new Left(new InvalidUsernameOrPassword());
    }

    const passwordMatches = await bcryptjs.compare(
      password,
      user.password.value,
    );

    return passwordMatches
      ? new Right(user)
      : new Left(new InvalidUsernameOrPassword());
  }

  /**
   * Validates a user's JWT.
   *
   * @param id The ID of the user to validate.
   * @returns the user if the credentials are valid, or null if they are
   * not.
   */
  async validateById(id: string): Promise<Either<Error, User>> {
    const user = await this._userRepository.findOneById(id);
    return user ? new Right(user) : new Left(new InvalidUsernameOrPassword());
  }
}

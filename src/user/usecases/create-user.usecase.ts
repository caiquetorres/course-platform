import { Injectable } from '@nestjs/common';

import { Role } from '../domain/models/role.enum';
import { User } from '../domain/models/user';
import { CreateUserDto } from '../presentation/create-user.dto';

import { Either, Left, Right } from '../../common/domain/classes/either';
import { DuplicatedEmailError } from '../domain/errors/duplicated-email.error';
import { DuplicatedUsernameError } from '../domain/errors/duplicated-username.error';
import { Email } from '../domain/value-objects/email';
import { Password } from '../domain/value-objects/password';
import { Username } from '../domain/value-objects/username';
import { UserRepository } from '../infrastructure/repositories/user.repository';

/**
 * Use case for creating a new user.
 */
@Injectable()
export class CreateUserUseCase {
  constructor(private readonly _userRepository: UserRepository) {}

  /**
   * Creates a new user with the provided data.
   *
   * @param requestUser The user who is making the request.
   * @param dto The data for creating the new user.
   * @returns A promise that resolves to an `Either` type representing
   * either an error or the created user.
   */
  async create(
    _requestUser: User,
    dto: CreateUserDto,
  ): Promise<Either<Error, User>> {
    let result = await this._hasUserWithUsername(dto.username);
    if (result) {
      return new Left(DuplicatedUsernameError.withUsername(dto.username));
    }

    result = await this._hasUserWithEmail(dto.username);
    if (result) {
      return new Left(DuplicatedEmailError.withEmail(dto.email));
    }

    let user = new User({
      name: dto.name,
      email: new Email(dto.email),
      username: new Username(dto.username),
      password: Password.from(dto.password),
      roles: new Set([Role.user]),
    });

    user = await this._userRepository.createOne(user);
    return new Right(user);
  }

  /**
   * Checks if a user with the specified username exists.
   *
   * @param username The username to check.
   * @returns A promise that resolves to a boolean indicating if a user
   * with the username exists.
   */
  private async _hasUserWithUsername(username: string): Promise<boolean> {
    return this._userRepository
      .findOneByUsername(username)
      .then((res) => !!res);
  }

  /**
   * Checks if a user with the specified email exists.
   *
   * @param email The email to check.
   * @returns A promise that resolves to a boolean indicating if a user
   * with the email exists.
   */
  private async _hasUserWithEmail(email: string): Promise<boolean> {
    return this._userRepository.findOneByEmail(email).then((res) => !!res);
  }
}

import {
  ConflictException,
  HttpException,
  Injectable,
  Optional,
} from '@nestjs/common';

import { Log } from '../../log/domain/models/log';
import { Role } from '../domain/models/role.enum';
import { User } from '../domain/models/user';
import { CreateUserDto } from '../presentation/create-user.dto';

import { Either, Left, Right } from '../../common/domain/classes/either';
import { LogRepository } from '../../log/infrastructure/repositories/log.repository';
import { Email } from '../domain/value-objects/email';
import { Password } from '../domain/value-objects/password';
import { Username } from '../domain/value-objects/username';
import { UserRepository } from '../infrastructure/repositories/user.repository';

@Injectable()
export class CreateUserUseCase {
  constructor(
    private readonly _userRepository: UserRepository,
    @Optional()
    private readonly _logRepository?: LogRepository,
  ) {}

  async create(
    _requestUser: User,
    dto: CreateUserDto,
  ): Promise<Either<HttpException, User>> {
    let result = await this._hasUserWithUsername(dto.username);
    if (result) {
      return new Left(
        new ConflictException(
          `The username '${dto.username}' has already been registered.`,
        ),
      );
    }

    result = await this._hasUserWithEmail(dto.email);
    if (result) {
      return new Left(
        new ConflictException(
          `The email '${dto.email}' has already been registered.`,
        ),
      );
    }

    let user = new User({
      name: dto.name,
      email: new Email(dto.email),
      username: new Username(dto.username),
      password: Password.from(dto.password),
      roles: new Set([Role.user]),
      credits: 300,
    });

    user = await this._userRepository.save(user);

    await this._logRepository?.save(
      new Log({
        user: user,
        resource: CreateUserUseCase.name,
        action: 'added',
        credits: 300,
      }),
    );

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

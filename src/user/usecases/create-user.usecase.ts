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

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly _userRepository: UserRepository) {}

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

  private async _hasUserWithUsername(username: string): Promise<boolean> {
    return this._userRepository
      .findOneByUsername(username)
      .then((res) => !!res);
  }

  private async _hasUserWithEmail(email: string): Promise<boolean> {
    return this._userRepository.findOneByEmail(email).then((res) => !!res);
  }
}

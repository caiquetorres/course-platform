import { Injectable } from '@nestjs/common';

import { Role } from '../domain/models/role.enum';
import { User } from '../domain/models/user';

import { Either, Left, Right } from '../../common/domain/classes/either';
import { ForbiddenError } from '../../common/domain/errors/forbidden.error';
import { UserRepository } from '../infrastructure/repositories/user.repository';

/**
 * Use case for getting the request user.
 */
@Injectable()
export class FindMeUseCase {
  constructor(private readonly _userRepository: UserRepository) {}

  /**
   * Gets the user who is making the request.
   *
   * @param requestUser The user who is making the request.
   * @returns A promise that resolves to an `Either` type representing
   * either an error or the found user.
   */
  async findMe(requestUser: User): Promise<Either<Error, User>> {
    if (requestUser.hasRole(Role.guest)) {
      return new Left(new ForbiddenError());
    }

    const user = await this._userRepository.findOneById(requestUser.id);
    return new Right(user);
  }
}

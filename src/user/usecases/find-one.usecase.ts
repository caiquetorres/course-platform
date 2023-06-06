import { Injectable } from '@nestjs/common';

import { Role } from '../domain/models/role.enum';
import { User } from '../domain/models/user';

import { Either, Left, Right } from '../../common/domain/classes/either';
import { ForbiddenError } from '../../common/domain/errors/forbidden.error';
import { UserNotFoundError } from '../domain/errors/user-not-found.error';
import { UserRepository } from '../infrastructure/repositories/user.repository';

/**
 * Use case for getting a user given his id.
 */
@Injectable()
export class FindOneUseCase {
  constructor(private readonly _userRepository: UserRepository) {}

  /**
   * Retrieves a user by ID.
   *
   * @param requestUser The user making the request.
   * @param userId The ID of the user to retrieve.
   * @returns A promise that resolves to an `Either` containing the
   * retrieved user or an error.
   */
  async findOne(
    requestUser: User,
    userId: string,
  ): Promise<Either<Error, User>> {
    const user = await this._userRepository.findOneById(userId);

    if (!user) {
      return new Left(UserNotFoundError.withId(userId));
    }

    find: {
      if (requestUser.hasRole(Role.admin)) {
        break find;
      }

      if (requestUser.equals(user)) {
        break find;
      }

      return new Left(new ForbiddenError());
    }

    return new Right(user);
  }
}

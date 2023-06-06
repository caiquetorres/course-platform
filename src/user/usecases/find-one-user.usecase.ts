import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Role } from '../domain/models/role.enum';
import { User } from '../domain/models/user';

import { Either, Left, Right } from '../../common/domain/classes/either';
import { UserRepository } from '../infrastructure/repositories/user.repository';

/**
 * Use case for getting a user given his id.
 */
@Injectable()
export class FindOneUserUseCase {
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
      return new Left(
        new NotFoundException(
          `The user identified by '${userId}' was not found`,
        ),
      );
    }

    find: {
      if (requestUser.hasRole(Role.admin)) {
        break find;
      }

      if (requestUser.equals(user)) {
        break find;
      }

      return new Left(
        new ForbiddenException(
          'You do not have permissions to access these sources',
        ),
      );
    }

    return new Right(user);
  }
}

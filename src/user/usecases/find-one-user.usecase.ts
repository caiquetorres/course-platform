import {
  ForbiddenException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Role } from '../domain/models/role.enum';
import { User } from '../domain/models/user';

import { Either, Left, Right } from '../../common/domain/classes/either';
import { UserRepository } from '../infrastructure/repositories/user.repository';

@Injectable()
export class FindOneUserUseCase {
  constructor(private readonly _userRepository: UserRepository) {}

  async findOne(
    requestUser: User,
    userId: string,
  ): Promise<Either<HttpException, User>> {
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

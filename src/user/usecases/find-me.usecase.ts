import { ForbiddenException, Injectable } from '@nestjs/common';

import { Role } from '../domain/models/role.enum';
import { User } from '../domain/models/user';

import { Either, Left, Right } from '../../common/domain/classes/either';
import { UserRepository } from '../infrastructure/repositories/user.repository';

@Injectable()
export class FindMeUseCase {
  constructor(private readonly _userRepository: UserRepository) {}

  async findMe(requestUser: User): Promise<Either<Error, User>> {
    if (requestUser.hasRole(Role.guest)) {
      return new Left(
        new ForbiddenException(
          'You do not have permissions to access these sources',
        ),
      );
    }

    const user = await this._userRepository.findOneById(requestUser.id);
    return new Right(user);
  }
}

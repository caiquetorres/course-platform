import { ForbiddenException, HttpException, Injectable } from '@nestjs/common';

import { Role } from '../domain/models/role.enum';
import { User } from '../domain/models/user';

import { Either, Left, Right } from '../../common/domain/classes/either';
import { IPage } from '../../common/domain/interfaces/page.interface';
import { PageQuery } from '../../common/presentation/page.query';
import { UserRepository } from '../infrastructure/repositories/user.repository';

@Injectable()
export class FindManyUsersUseCase {
  constructor(private readonly _userRepository: UserRepository) {}

  async findMany(
    requestUser: User,
    query: PageQuery,
  ): Promise<Either<HttpException, IPage<User>>> {
    if (!requestUser.hasRole(Role.admin)) {
      return new Left(
        new ForbiddenException(
          'You do not have permissions to access these sources',
        ),
      );
    }

    const page = await this._userRepository.findMany(query);
    return new Right(page);
  }
}

import {
  ForbiddenException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Role } from '../domain/models/role.enum';
import { User } from '../domain/models/user';
import { UpdateUserDto } from '../presentation/update-user.dto';

import { Either, Left, Right } from '../../common/domain/classes/either';
import { UserRepository } from '../infrastructure/repositories/user.repository';

@Injectable()
export class UpdateUserUseCase {
  constructor(private readonly _userRepository: UserRepository) {}

  async update(
    requestUser: User,
    userId: string,
    dto: UpdateUserDto,
  ): Promise<Either<HttpException, User>> {
    let user = await this._userRepository.findOneById(userId);

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

    user = await this._userRepository.save(
      new User({ ...user, name: dto.name }),
    );
    return new Right(user);
  }
}

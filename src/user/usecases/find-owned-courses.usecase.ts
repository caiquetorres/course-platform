import { ForbiddenException, HttpException, Injectable } from '@nestjs/common';

import { Course } from '../../course/domain/models/course';
import { Role } from '../domain/models/role.enum';
import { User } from '../domain/models/user';

import { Either, Left, Right } from '../../common/domain/classes/either';
import { IPage } from '../../common/domain/interfaces/page.interface';
import { PageQuery } from '../../common/presentation/page.query';
import { CourseRepository } from '../../course/infrastructure/repositories/course.repository';

@Injectable()
export class FindOwnedCoursesUseCase {
  constructor(private readonly _courseRepository: CourseRepository) {}

  async find(
    requestUser: User,
    pageQuery: PageQuery,
  ): Promise<Either<HttpException, IPage<Course>>> {
    if (!requestUser.hasRole(Role.author)) {
      return new Left(
        new ForbiddenException(
          'You do not have permissions to access these sources',
        ),
      );
    }

    const page = await this._courseRepository.findManyByAuthorId(
      requestUser.id,
      pageQuery,
    );
    return new Right(page);
  }
}

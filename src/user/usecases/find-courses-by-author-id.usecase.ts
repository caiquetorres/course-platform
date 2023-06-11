import { HttpException, Injectable } from '@nestjs/common';

import { Course } from '../../course/domain/models/course';
import { User } from '../domain/models/user';

import { Either, Right } from '../../common/domain/classes/either';
import { IPage } from '../../common/domain/interfaces/page.interface';
import { PageQuery } from '../../common/presentation/page.query';
import { CourseRepository } from '../../course/infrastructure/repositories/course.repository';

@Injectable()
export class FindCoursesByAuthorIdUseCase {
  constructor(private readonly _courseRepository: CourseRepository) {}

  async find(
    _requestUser: User,
    authorId: string,
    pageQuery: PageQuery,
  ): Promise<Either<HttpException, IPage<Course>>> {
    const page = await this._courseRepository.findManyByAuthorId(
      authorId,
      pageQuery,
    );
    return new Right(page);
  }
}

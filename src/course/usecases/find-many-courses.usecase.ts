import { HttpException, Injectable } from '@nestjs/common';

import { User } from '../../user/domain/models/user';
import { Course } from '../domain/models/course';

import { Either, Right } from '../../common/domain/classes/either';
import { IPage } from '../../common/domain/interfaces/page.interface';
import { PageQuery } from '../../common/presentation/page.query';
import { CourseRepository } from '../infrastructure/repositories/course.repository';

@Injectable()
export class FindManyCoursesUseCase {
  constructor(private readonly _courseRepository: CourseRepository) {}

  async findMany(
    _requestUser: User,
    query: PageQuery,
  ): Promise<Either<HttpException, IPage<Course>>> {
    const page = await this._courseRepository.findMany(query);
    return new Right(page);
  }
}

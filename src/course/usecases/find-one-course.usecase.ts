import { HttpException, Injectable, NotFoundException } from '@nestjs/common';

import { User } from '../../user/domain/models/user';
import { Course } from '../domain/models/course';

import { Either, Left, Right } from '../../common/domain/classes/either';
import { CourseRepository } from '../infrastructure/repositories/course.repository';

@Injectable()
export class FindOneCourseUseCase {
  constructor(private readonly _courseRepository: CourseRepository) {}

  async findOne(
    _requestUser: User,
    courseId: string,
  ): Promise<Either<HttpException, Course>> {
    const course = await this._courseRepository.findOneById(courseId);

    if (!course) {
      return new Left(
        new NotFoundException(
          `The course identified by '${courseId}' was not found`,
        ),
      );
    }

    return new Right(course);
  }
}

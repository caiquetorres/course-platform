import { ForbiddenException, HttpException, Injectable } from '@nestjs/common';

import { Role } from '../../user/domain/models/role.enum';
import { User } from '../../user/domain/models/user';
import { Course } from '../domain/models/course';
import { CreateCourseDto } from '../presentation/create-course.dto';

import { Either, Left, Right } from '../../common/domain/classes/either';
import { Price } from '../domain/value-objects/price';
import { CourseRepository } from '../infrastructure/repositories/course.repository';

/**
 * Use case for creating a new course.
 */
@Injectable()
export class CreateCourseUseCase {
  constructor(private readonly _courseRepository: CourseRepository) {}

  /**
   * Creates a new course with the provided data.
   *
   * @param requestUser The user who is making the request.
   * @param dto The data for creating the new course.
   * @returns A promise that resolves to an `Either` type representing
   * either an error or the created course.
   */
  async create(
    requestUser: User,
    dto: CreateCourseDto,
  ): Promise<Either<HttpException, Course>> {
    if (!requestUser.hasRole(Role.author)) {
      return new Left(
        new ForbiddenException(
          'You do not have permissions to access these sources',
        ),
      );
    }

    const course = await this._courseRepository.save(
      new Course({
        name: dto.name,
        price: new Price(dto.price),
        owner: requestUser,
      }),
    );
    return new Right(course);
  }
}

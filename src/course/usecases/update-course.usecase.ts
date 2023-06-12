import {
  ForbiddenException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Role } from '../../user/domain/models/role.enum';
import { User } from '../../user/domain/models/user';
import { Course } from '../domain/models/course';
import { UpdateCourseDto } from '../presentation/update-course.dto';

import { Either, Left, Right } from '../../common/domain/classes/either';
import { Price } from '../domain/value-objects/price';
import { CourseRepository } from '../infrastructure/repositories/course.repository';

@Injectable()
export class UpdateCourseUseCase {
  constructor(private readonly _courseRepository: CourseRepository) {}

  async update(
    requestUser: User,
    courseId: string,
    dto: UpdateCourseDto,
  ): Promise<Either<HttpException, Course>> {
    let course = await this._courseRepository.findOneById(courseId);

    if (!course) {
      return new Left(
        new NotFoundException(
          `The course identified by '${courseId}' was not found`,
        ),
      );
    }

    validate: {
      if (requestUser.hasRole(Role.admin)) {
        break validate;
      }

      if (requestUser.owns(course)) {
        break validate;
      }

      return new Left(
        new ForbiddenException(
          'You do not have permissions to access these sources',
        ),
      );
    }

    course = await this._courseRepository.save(
      new Course({
        ...course,
        ...(dto.price && { price: new Price(dto.price) }),
        name: dto.name,
      }),
    );
    return new Right(course);
  }
}

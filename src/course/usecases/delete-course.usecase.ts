import {
  ForbiddenException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Role } from '../../user/domain/models/role.enum';
import { User } from '../../user/domain/models/user';
import { Course } from '../domain/models/course';

import { Either, Left, Right } from '../../common/domain/classes/either';
import { CourseRepository } from '../infrastructure/repositories/course.repository';

@Injectable()
export class DeleteCourseUseCase {
  constructor(private readonly _courseRepository: CourseRepository) {}

  async delete(
    requestUser: User,
    courseId: string,
  ): Promise<Either<HttpException, void>> {
    const course = await this._courseRepository.findOneById(courseId);

    if (!course) {
      return new Left(
        new NotFoundException(
          `The course identified by '${courseId}' was not found`,
        ),
      );
    }

    if (!this._canDelete(requestUser, course)) {
      return new Left(
        new ForbiddenException(
          'You do not have permissions to delete this course',
        ),
      );
    }

    await this._courseRepository.removeOne(course);
    return new Right(void 0);
  }

  private _canDelete(user: User, course: Course) {
    if (user.hasRole(Role.admin)) {
      return true;
    }

    if (user.owns(course)) {
      return true;
    }

    return false;
  }
}

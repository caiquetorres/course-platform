import {
  ForbiddenException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Role } from '../../user/domain/models/role.enum';
import { User } from '../../user/domain/models/user';

import { Either, Left, Right } from '../../common/domain/classes/either';
import { CourseRepository } from '../infrastructure/repositories/course.repository';
import { EnrollmentRepository } from '../infrastructure/repositories/enrollment.repository';

@Injectable()
export class QuitFromCourseUseCase {
  constructor(
    private readonly _enrollmentRepository: EnrollmentRepository,
    private readonly _courseRepository: CourseRepository,
  ) {}

  async quit(
    requestUser: User,
    courseId: string,
  ): Promise<Either<HttpException, void>> {
    if (requestUser.hasRole(Role.guest)) {
      return new Left(
        new ForbiddenException(
          'You do not have permissions to enroll in a course',
        ),
      );
    }

    const course = await this._courseRepository.findOneById(courseId);

    if (!course) {
      return new Left(
        new NotFoundException(
          `The course identified by '${courseId}' was not found`,
        ),
      );
    }

    const enrollment = await this._enrollmentRepository.findByOwnerAndCourse(
      requestUser,
      course,
    );

    if (!enrollment) {
      return new Left(
        new NotFoundException('You are not enrolled in this course'),
      );
    }

    await this._enrollmentRepository.remove(enrollment);
    return new Right(void 0);
  }
}

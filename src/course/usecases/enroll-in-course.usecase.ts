import {
  ConflictException,
  ForbiddenException,
  HttpException,
  ImATeapotException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Role } from '../../user/domain/models/role.enum';
import { User } from '../../user/domain/models/user';
import { Enrollment } from '../domain/models/enrollment';

import { Either, Left, Right } from '../../common/domain/classes/either';
import { CourseRepository } from '../infrastructure/repositories/course.repository';
import { EnrollmentRepository } from '../infrastructure/repositories/enrollment.repository';

@Injectable()
export class EnrollInCourseUseCase {
  constructor(
    private readonly _enrollmentRepository: EnrollmentRepository,
    private readonly _courseRepository: CourseRepository,
  ) {}

  async enroll(
    requestUser: User,
    courseId: string,
  ): Promise<Either<HttpException, Enrollment>> {
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

    if (requestUser.owns(course)) {
      return new Left(
        new ImATeapotException('You cannot enroll into your own course'),
      );
    }

    let enrollment = await this._enrollmentRepository.findByOwnerAndCourse(
      requestUser,
      course,
    );

    if (enrollment) {
      return new Left(
        new ConflictException('You are already enrolled in this course'),
      );
    }

    enrollment = new Enrollment({
      owner: requestUser,
      course,
    });

    enrollment = await this._enrollmentRepository.save(enrollment);
    return new Right(enrollment);
  }
}

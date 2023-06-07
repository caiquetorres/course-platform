import { Injectable, NotFoundException } from '@nestjs/common';

import { User } from '../../user/domain/models/user';
import { UpdateCourseDto } from '../presentation/update-course.dto';

import { Left } from '../../common/domain/classes/either';
import { CourseRepository } from '../infrastructure/repositories/course.repository';

@Injectable()
export class UpdateCourseUsecase {
  constructor(private readonly _courseRepository: CourseRepository) {}

  async updateOne(requestUser: User, courseId: string, dto: UpdateCourseDto) {
    const course = await this._courseRepository.findOneById(courseId);

    if (!course) {
      return new Left(
        new NotFoundException(
          `The course identified by '${courseId}' was not found`,
        ),
      );
    }
  }
}

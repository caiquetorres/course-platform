import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../../user/entities/user.entity';
import { Course } from '../entities/course.entity';
import { Enrollment } from '../entities/enrollment.entity';

import { IEnrollmentService } from '../interfaces/enrollment.service.interface';

import { EnrollmentFactory } from '../factories/enrollment.factory';

@Injectable()
export class EnrollmentService implements IEnrollmentService {
  constructor(
    @InjectRepository(Enrollment)
    private readonly _enrollmentRepository: Repository<Enrollment>,
    @InjectRepository(Course)
    private readonly _courseRepository: Repository<Course>,
  ) {}

  async enroll(requestUser: User, courseId: string) {
    const course = await this._courseRepository.findOneBy({ id: courseId });

    if (!course) {
      throw new NotFoundException(`Course with id '${courseId}' not found`);
    }

    if (this._hasEnrollmentWithUserIdAndCourseId(requestUser.id, courseId)) {
      throw new ConflictException(
        'The user is already enrolled in this course',
      );
    }

    const enroll = async () => {
      const enrollment = new EnrollmentFactory()
        .withCourse(course)
        .withOwner(requestUser)
        .build();

      return this._enrollmentRepository.save(enrollment);
    };

    return enroll();
  }

  async withdraw(requestUser: User, courseId: string) {
    if (!this._hasEnrollmentWithUserIdAndCourseId(requestUser.id, courseId)) {
      throw new NotFoundException(
        'The user is not already enrolled in this course',
      );
    }

    const enrollment = await this._enrollmentRepository.findOne({
      where: {
        owner: { id: requestUser.id },
        course: { id: courseId },
      },
      relations: ['owner', 'courses'],
    });

    return this._enrollmentRepository.remove(enrollment);
  }

  private async _hasEnrollmentWithUserIdAndCourseId(
    userId: string,
    courseId: string,
  ) {
    const enrollment = await this._enrollmentRepository.findOne({
      where: {
        owner: { id: userId },
        course: { id: courseId },
      },
      relations: ['owner', 'courses'],
    });
    return !!enrollment;
  }
}

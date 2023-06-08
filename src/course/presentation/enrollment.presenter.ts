import { ApiProperty } from '@nestjs/swagger';

import { Enrollment } from '../domain/models/enrollment';

import { UserPresenter } from '../../user/presentation/user.presenter';
import { CoursePresenter } from './course.presenter';
import { v4 } from 'uuid';

export class EnrollmentPresenter {
  @ApiProperty({ example: v4() })
  readonly id?: string;

  @ApiProperty({ example: new Date() })
  readonly createdAt?: Date;

  @ApiProperty({ example: new Date() })
  readonly updatedAt?: Date;

  @ApiProperty({ example: null })
  readonly deletedAt?: Date;

  @ApiProperty({ example: 7.0 })
  readonly average: number;

  @ApiProperty({ example: false })
  readonly isCompleted: boolean;

  @ApiProperty({ type: () => UserPresenter })
  readonly owner: UserPresenter;

  @ApiProperty({ type: () => CoursePresenter })
  readonly course: CoursePresenter;

  constructor(enrollment: Enrollment) {
    this.id = enrollment.id;
    this.createdAt = enrollment.createdAt;
    this.updatedAt = enrollment.updatedAt;
    this.deletedAt = enrollment.deletedAt;
    this.average = +enrollment.average;
    this.isCompleted = enrollment.isCompleted;
    this.owner = new UserPresenter(enrollment.owner);
    this.course = new CoursePresenter(enrollment.course);

    Object.freeze(this);
  }
}

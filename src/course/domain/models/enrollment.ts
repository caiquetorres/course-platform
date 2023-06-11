import { User } from '../../../user/domain/models/user';

import { IEnrollment } from '../interfaces/enrollment.interface';
import { Average } from '../value-objects/average';
import { Course } from './course';

interface IEnrollmentConstructor {
  /**
   * The unique identifier for the course.
   */
  id?: string;

  /**
   * The date and time when the course was created.
   */
  createdAt?: Date;

  /**
   * The date and time when the course was last updated.
   */
  updatedAt?: Date;

  /**
   * The date and time when the course was deleted.
   */
  deletedAt?: Date | null;

  average?: Average;

  isCompleted?: boolean;

  owner: User;

  course: Course;
}

export class Enrollment implements Readonly<IEnrollment> {
  /**
   * @inheritdoc
   */
  readonly id?: string;

  /**
   * @inheritdoc
   */
  readonly createdAt?: Date;

  /**
   * @inheritdoc
   */
  readonly updatedAt?: Date;

  /**
   * @inheritdoc
   */
  readonly deletedAt?: Date;

  readonly average = new Average(0);

  readonly isCompleted = false;

  readonly owner: User;

  readonly course: Course;

  constructor(enrollment: IEnrollmentConstructor) {
    Object.assign(this, enrollment);

    this.owner = new User(enrollment.owner);
    this.course = new Course(enrollment.course);

    Object.freeze(this);
  }
}

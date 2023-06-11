import { Course } from '../../../src/course/domain/models/course';
import { Enrollment } from '../../../src/course/domain/models/enrollment';
import { User } from '../../../src/user/domain/models/user';

import { IEnrollment } from '../../../src/course/domain/interfaces/enrollment.interface';
import { Average } from '../../../src/course/domain/value-objects/average';
import { v4 } from 'uuid';

export class EnrollmentBuilder {
  private readonly _enrollment: Partial<IEnrollment> = {};

  withId(id: string) {
    this._enrollment.id = id;
    return this;
  }

  withRandomId() {
    this._enrollment.id = v4();
    return this;
  }

  withIsCompleted(isCompleted: boolean) {
    this._enrollment.isCompleted = isCompleted;
    return this;
  }

  withAverage(average: Average) {
    this._enrollment.average = average;
    return this;
  }

  withOwner(owner: User) {
    this._enrollment.owner = new User(owner);
    return this;
  }

  withCourse(course: Course) {
    this._enrollment.course = new Course(course);
    return this;
  }

  build() {
    return new Enrollment(this._enrollment as any);
  }
}

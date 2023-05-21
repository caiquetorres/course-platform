import { Enrollment } from '../entities/enrollment.entity';

import { IUser } from '../../user/interfaces/user.interface';
import { ICourse } from '../interfaces/course.interface';

export class EnrollmentFactory {
  private _isCompleted = false;

  private _average = 0;

  private _owner: IUser;

  private _course: ICourse;

  withIsCompleted(isCompleted: boolean) {
    this._isCompleted = isCompleted;
    return this;
  }

  withAverage(average: number) {
    this._average = average;
    return this;
  }

  withOwner(owner: IUser) {
    this._owner = owner;
    return this;
  }

  withCourse(course: ICourse) {
    this._course = course;
    return this;
  }

  build() {
    return new Enrollment({
      isCompleted: this._isCompleted,
      average: this._average,
      owner: this._owner,
      course: this._course,
    });
  }
}

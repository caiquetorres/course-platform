import { Course } from '../models/course';

import { ICourse } from '../interfaces/course.interface';
import { Price } from '../value-objects/price';
import { v4 } from 'uuid';

export class CourseBuilder {
  private readonly _course: Partial<ICourse> = {};

  withId(id: string) {
    this._course.id = id;
    return this;
  }

  withRandomId() {
    this._course.id = v4();
    return this;
  }

  withName(name: string) {
    this._course.name = name;
    return this;
  }

  withPrice(price: Price) {
    this._course.price = price;
    return this;
  }

  build() {
    return new Course(this._course as ICourse);
  }
}

import { User } from '../../../user/domain/models/user';

import { ICourse } from '../interfaces/course.interface';
import { Price } from '../value-objects/price';

interface ICourseConstructor {
  id?: string;

  createdAt?: Date;

  updatedAt?: Date;

  deletedAt?: Date | null;

  name: string;

  price?: Price;

  owner: User;
}

export class Course implements Readonly<ICourse> {
  readonly id?: string;

  readonly createdAt?: Date;

  readonly updatedAt?: Date;

  readonly deletedAt?: Date;

  readonly name: string;

  readonly price: Price = new Price(0);

  readonly owner: User;

  /**
   * Whether the course is free or not.
   */
  get isFree() {
    return this.price.value === 0;
  }

  constructor(course: ICourseConstructor) {
    Object.assign(this, course);

    this.price = course.price ?? new Price(0);
    this.owner = new User(course.owner);

    Object.freeze(this);
  }
}

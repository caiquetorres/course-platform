import { User } from '../../../user/domain/models/user';

import { ICourse } from '../interfaces/course.interface';
import { Price } from '../value-objects/price';

interface ICourseConstructor {
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

  /**
   * The name of the course.
   */
  name: string;

  /**
   * The price of the course.
   */
  price?: Price;

  /**
   * The owner of the course.
   */
  owner: User;
}

export class Course implements Readonly<ICourse> {
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

  /**
   * @inheritdoc
   */
  readonly name: string;

  /**
   * @inheritdoc
   */
  readonly price: Price = new Price(0);

  /**
   * @inheritdoc
   */
  readonly owner: User;

  /**
   * Whether the course is free or not.
   */
  get isFree() {
    return this.price.value === 0;
  }

  constructor(course: ICourseConstructor) {
    Object.assign(this, course);

    this.price = new Price(course.price ? +course.price : 0);
    this.owner = new User(course.owner);

    Object.freeze(this);
  }
}

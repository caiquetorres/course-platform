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
   * Whether the course is free or not.
   */
  get isFree() {
    return this.price.value === 0;
  }

  constructor(course: ICourseConstructor) {
    Object.assign(this, course);
    Object.freeze(this);
  }
}

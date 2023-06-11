import { User } from '../../../user/domain/models/user';

import { Price } from '../value-objects/price';

export interface ICourse {
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
  price: Price;

  /**
   * The owner of the course.
   */
  owner: User;
}

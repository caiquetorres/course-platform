import { Role } from '../models/role.enum';

import { Email } from '../value-objects/email';
import { Password } from '../value-objects/password';
import { Username } from '../value-objects/username';

/**
 * Interface representing a user.
 */
export interface IUser {
  /**
   * The unique identifier for the user.
   */
  id?: string;

  /**
   * The date and time when the user was created.
   */
  createdAt?: Date;

  /**
   * The date and time when the user was last updated.
   */
  updatedAt?: Date;

  /**
   * The date and time when the user was deleted.
   */
  deletedAt?: Date;

  /**
   * The name of the user.
   */
  name: string;

  /**
   * The username of the user.
   */
  username: Username;

  /**
   * The email address of the user.
   */
  email: Email;

  /**
   * The password of the user.
   */
  password: Password;

  credits: number;

  /**
   * The roles assigned to the user.
   */
  roles: Set<Role>;
}

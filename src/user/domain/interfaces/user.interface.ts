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
  readonly id?: string;

  /**
   * The date and time when the user was created.
   */
  readonly createdAt?: Date;

  /**
   * The date and time when the user was last updated.
   */
  readonly updatedAt?: Date;

  /**
   * The date and time when the user was deleted.
   */
  readonly deletedAt?: Date;

  /**
   * The name of the user.
   */
  readonly name: string;

  /**
   * The username of the user.
   */
  readonly username: Username;

  /**
   * The email address of the user.
   */
  readonly email: Email;

  /**
   * The password of the user.
   */
  readonly password: Password;

  /**
   * The roles assigned to the user.
   */
  readonly roles: Set<Role>;
}

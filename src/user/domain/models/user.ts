import { Role } from './role.enum';

import { IUser } from '../interfaces/user.interface';
import { Email } from '../value-objects/email';
import { Password } from '../value-objects/password';
import { Username } from '../value-objects/username';

export class User implements Readonly<IUser> {
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
  readonly username: Username;

  /**
   * @inheritdoc
   */
  readonly email: Email;

  /**
   * @inheritdoc
   */
  readonly password: Password;

  /**
   * @inheritdoc
   */
  readonly roles: Set<Role>;

  constructor(user: IUser) {
    Object.assign(this, user);
    this.roles = new Set(user.roles);

    Object.freeze(this);
  }

  /**
   * Checks if the user has the specified role.
   *
   * @param role The role to check.
   * @returns A boolean indicating if the user has the specified role.
   */
  hasRole(role: Role) {
    return this.roles.has(role);
  }

  /**
   * Checks if the user is equal to the specified value or entity.
   *
   * @param id The ID or entity to compare with.
   * @returns A boolean indicating if the user is equal to the specified
   * value.
   */
  equals(id: string): boolean;

  /**
   * Checks if the user is equal to the specified entity.
   *
   * @param entity The entity to compare with.
   * @returns A boolean indicating if the user is equal to the specified
   * entity.
   */
  equals<T extends IUser>(entity: T): boolean;

  equals(value: string | IUser) {
    if (!value) {
      return false;
    }

    if (typeof value === 'string') {
      return this.id === value;
    }

    return this.id === value.id;
  }
}

import { Role } from './role.enum';

import { IUser } from '../interfaces/user.interface';
import { Email } from '../value-objects/email';
import { Password } from '../value-objects/password';
import { Username } from '../value-objects/username';

export class User implements IUser {
  readonly id?: string;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
  readonly deletedAt?: Date;

  readonly name: string;
  readonly username: Username;
  readonly email: Email;
  readonly password: Password;
  readonly roles: Set<Role>;

  constructor(data: IUser) {
    this.id = data.id;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.deletedAt = data.deletedAt;

    this.name = data.name;
    this.username = data.username;
    this.email = data.email;
    this.password = data.password;
    this.roles = new Set(data.roles);

    Object.freeze(this);
  }

  hasRole(role: Role) {
    return this.roles.has(role);
  }

  equals(id: string): boolean;

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

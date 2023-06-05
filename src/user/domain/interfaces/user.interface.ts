import { Role } from '../models/role.enum';

import { Email } from '../value-objects/email';
import { Password } from '../value-objects/password';
import { Username } from '../value-objects/username';

export interface IUser {
  readonly id?: string;

  readonly createdAt?: Date;

  readonly updatedAt?: Date;

  readonly deletedAt?: Date;

  readonly name: string;

  readonly username: Username;

  readonly email: Email;

  readonly password: Password;

  readonly roles: Set<Role>;
}

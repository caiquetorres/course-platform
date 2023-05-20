import { User } from '../entities/user.entity';

import { Role } from '../enums/role.enum';

import { IUser } from '../interfaces/user.interface';
import { Email } from '../value-objects/email';
import { Password } from '../value-objects/password';

export class UserFactory {
  private _name: string | null = null;

  private _username: string | null = null;

  private _email: string | null;

  private _password: string | null;

  private _roles = new Set<Role>();

  from(user: Partial<IUser>) {
    return this.withName(user.name)
      .withUsername(user.username)
      .withEmail(new Email(user.email))
      .withPassword(new Password(user.password))
      .withRoles(user.roles);
  }

  withName(name: string) {
    this._name = name ?? null;
    return this;
  }

  withUsername(username: string) {
    this._username = username ?? null;
    return this;
  }

  withEmail(email: Email) {
    this._email = email.value ?? null;
    return this;
  }

  withPassword(password: Password) {
    this._password = password.value ?? null;
    return this;
  }

  withRoles(roles: Role[]) {
    for (const role of roles) {
      this._roles.add(role);
    }
    return this;
  }

  asGuest() {
    this._roles.add(Role.guest);
    return this;
  }

  asUser() {
    this._roles.add(Role.user);
    return this;
  }

  asAdmin() {
    this._roles.add(Role.admin);
    return this;
  }

  build() {
    return new User({
      name: this._name,
      email: this._email,
      username: this._username,
      password: this._password,
      roles: Array.from(this._roles),
    });
  }
}

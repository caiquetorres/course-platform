import { Role } from '../../../src/user/domain/models/role.enum';
import { User } from '../../../src/user/domain/models/user';

import { IUser } from '../../../src/user/domain/interfaces/user.interface';
import { Email } from '../../../src/user/domain/value-objects/email';
import { Password } from '../../../src/user/domain/value-objects/password';
import { Username } from '../../../src/user/domain/value-objects/username';
import { v4 } from 'uuid';

export class UserBuilder {
  private _user: Partial<IUser> = {};

  private _roles = new Set<Role>();

  withId(id: string) {
    this._user.id = id;
    return this;
  }

  withRandomId() {
    this._user.id = v4();
    return this;
  }

  withName(name: string) {
    this._user.name = name;
    return this;
  }

  withUsername(username: Username) {
    this._user.username = username;
    return this;
  }

  withEmail(email: Email) {
    this._user.email = email;
    return this;
  }

  withCredits(credits: number) {
    this._user.credits = credits;
    return this;
  }

  withPassword(password: Password) {
    this._user.password = password;
    return this;
  }

  withRoles(...roles: Role[]) {
    for (const role of roles) {
      this._roles.add(role);
    }
    return this;
  }

  asUser() {
    this._roles.add(Role.user);
    return this;
  }

  asPro() {
    this._roles.add(Role.pro);
    return this;
  }

  asAuthor() {
    this._roles.add(Role.author);
    return this;
  }

  asAdmin() {
    this._roles.add(Role.admin);
    return this;
  }

  asGuest() {
    this._roles.add(Role.guest);
    return this;
  }

  build() {
    return new User({
      ...this._user,
      roles: this._roles,
    } as IUser);
  }
}

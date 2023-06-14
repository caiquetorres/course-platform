import { Course } from '../../../course/domain/models/course';
import { Project } from '../../../project/domain/models/project';
import { Comment } from '../../../topic/domain/models/comment';
import { Topic } from '../../../topic/domain/models/topic';
import { Role } from './role.enum';

import { IUser } from '../interfaces/user.interface';
import { Email } from '../value-objects/email';
import { Password } from '../value-objects/password';
import { Username } from '../value-objects/username';

interface IUserConstructor {
  id?: string;

  createdAt?: Date;

  updatedAt?: Date;

  deletedAt?: Date;

  name: string;

  username: Username;

  email: Email;

  password: Password;

  credits?: number;

  roles: Set<Role>;
}

export class User implements Readonly<IUser> {
  readonly id?: string;

  readonly createdAt?: Date;

  readonly updatedAt?: Date;

  readonly deletedAt?: Date | null;

  readonly name: string;

  readonly username: Username;

  readonly email: Email;

  readonly password: Password;

  readonly credits = 0;

  readonly roles: Set<Role>;

  constructor(user: IUserConstructor) {
    Object.assign(this, user);
    this.roles = new Set(user.roles);

    Object.freeze(this);
  }

  owns(course: Course): boolean;

  owns(project: Project): boolean;

  owns(topic: Topic): boolean;

  owns(comment: Comment): boolean;

  owns(entity: Course | Project | Topic | Comment) {
    if (
      entity instanceof Course ||
      entity instanceof Project ||
      entity instanceof Topic ||
      entity instanceof Comment
    ) {
      return entity.owner.equals(this);
    }
    return false;
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

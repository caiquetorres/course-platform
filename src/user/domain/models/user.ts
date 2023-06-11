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

  credits?: number;

  /**
   * The roles assigned to the user.
   */
  roles: Set<Role>;
}

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
  readonly deletedAt?: Date | null;

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

  readonly credits = 0;

  /**
   * @inheritdoc
   */
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

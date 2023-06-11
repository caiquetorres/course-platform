import { User } from '../../../user/domain/models/user';

import { IUser } from '../../../user/domain/interfaces/user.interface';
import { IProject } from '../interfaces/project.interface';
import { ApplicationStatus } from '../value-objects/application-status';
import { Project } from './project';

interface IApplicationConstructor {
  id?: string;

  createdAt?: Date;

  updatedAt?: Date;

  deletedAt?: Date | null;

  status?: ApplicationStatus;

  owner: IUser;

  project: IProject;
}

export class Application {
  /**
   * The unique identifier for the project.
   */
  readonly id?: string;

  /**
   * The date and time when the project was created.
   */
  readonly createdAt?: Date;

  /**
   * The date and time when the project was last updated.
   */
  readonly updatedAt?: Date;

  /**
   * The date and time when the project was deleted.
   */
  readonly deletedAt?: Date | null;

  readonly status = new ApplicationStatus('wait_listed');

  readonly owner: User;

  readonly project: Project;

  constructor(application: IApplicationConstructor) {
    Object.assign(this, application);
    Object.freeze(this);
  }
}

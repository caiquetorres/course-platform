import { User } from '../../../user/domain/models/user';

import { IProject } from '../interfaces/project.interface';

interface IProjectConstructor {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  name: string;
  description: string;
  owner: User;
}

export class Project implements Readonly<IProject> {
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

  readonly name: string;

  readonly description: string;

  readonly owner: User;

  constructor(project: IProjectConstructor) {
    Object.assign(this, project);
    Object.freeze(this);
  }
}

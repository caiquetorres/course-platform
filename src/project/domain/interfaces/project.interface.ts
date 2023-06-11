import { IUser } from '../../../user/domain/interfaces/user.interface';

export interface IProject {
  /**
   * The unique identifier for the project.
   */
  id?: string;

  /**
   * The date and time when the project was created.
   */
  createdAt?: Date;

  /**
   * The date and time when the project was last updated.
   */
  updatedAt?: Date;

  /**
   * The date and time when the project was deleted.
   */
  deletedAt?: Date | null;

  name: string;

  description: string;

  owner: IUser;
}

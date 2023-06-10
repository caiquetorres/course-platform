import { IUser } from '../../../user/domain/interfaces/user.interface';
import { ApplicationStatus } from '../value-objects/application-status';
import { IProject } from './project.interface';

export interface IApplication {
  status: ApplicationStatus;

  owner: IUser;

  project: IProject;
}

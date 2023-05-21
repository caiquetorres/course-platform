import { IBaseEntity } from '../../common/interfaces/base-entity.interface';

import { ApplicationStatus } from '../enums/application-status.enum';

import { IUser } from '../../user/interfaces/user.interface';
import { IProject } from './project.interface';

export interface IApplication extends IBaseEntity {
  status: ApplicationStatus;

  user: IUser;

  project: IProject;
}

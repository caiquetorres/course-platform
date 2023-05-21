import { Application } from '../entities/application.entity';

import { ApplicationStatus } from '../enums/application-status.enum';

import { IUser } from '../../user/interfaces/user.interface';
import { IProject } from '../interfaces/project.interface';

export class ApplicationFactory {
  private _status: ApplicationStatus | null = ApplicationStatus.waitListed;

  private _user: IUser | null = null;

  private _project: IProject | null = null;

  withStatus(status: ApplicationStatus) {
    this._status = status;
    return this;
  }

  withUser(user: IUser) {
    this._user = user;
    return this;
  }

  withProject(project: IProject) {
    this._project = project;
    return this;
  }

  build() {
    return new Application({
      status: this._status,
      user: this._user,
      project: this._project,
    });
  }
}

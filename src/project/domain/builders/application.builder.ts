import { Application } from '../models/application';

import { IUser } from '../../../user/domain/interfaces/user.interface';
import { IApplication } from '../interfaces/application.interface';
import { IProject } from '../interfaces/project.interface';
import { ApplicationStatus } from '../value-objects/application-status';

export class ApplicationBuilder {
  private readonly _application: Partial<IApplication> = {};

  withOwner(owner: IUser) {
    this._application.owner = owner;
    return this;
  }

  withProject(project: IProject) {
    this._application.project = project;
    return this;
  }

  withStatus(status: ApplicationStatus) {
    this._application.status = status;
    return this;
  }

  asAccepted() {
    this._application.status = new ApplicationStatus('accepted');
    return this;
  }

  asRejected() {
    this._application.status = new ApplicationStatus('rejected');
    return this;
  }

  asWaitListed() {
    this._application.status = new ApplicationStatus('wait_listed');
    return this;
  }

  build() {
    return new Application(this._application as Application);
  }
}

import { Application } from '../../../src/project/domain/models/application';

import { IApplication } from '../../../src/project/domain/interfaces/application.interface';
import { IProject } from '../../../src/project/domain/interfaces/project.interface';
import { ApplicationStatus } from '../../../src/project/domain/value-objects/application-status';
import { IUser } from '../../../src/user/domain/interfaces/user.interface';

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

import { User } from '../../../user/domain/models/user';
import { Project } from '../models/project';

import { IProject } from '../interfaces/project.interface';
import { v4 } from 'uuid';

export class ProjectBuilder {
  private readonly _project: Partial<IProject> = {};

  withId(id: string) {
    this._project.id = id;
    return this;
  }

  withRandomId() {
    this._project.id = v4();
    return this;
  }

  withName(name: string) {
    this._project.name = name;
    return this;
  }

  withDescription(description: string) {
    this._project.description = description;
    return this;
  }

  withOwner(owner: User) {
    this._project.owner = owner;
    return this;
  }

  build() {
    return new Project(this._project as Project);
  }
}

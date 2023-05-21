import { Project } from '../entities/project.entity';

import { IUser } from '../../user/interfaces/user.interface';
import { IProject } from '../interfaces/project.interface';

export class ProjectFactory {
  private _name: string | null = null;

  private _owner: IUser | null = null;

  from(project: IProject) {
    this._name = project.name;
    this._owner = project.owner;
    return this;
  }

  withName(name: string) {
    this._name = name;
    return this;
  }

  withOwner(owner: IUser) {
    this._owner = owner;
    return this;
  }

  build() {
    return new Project({
      owner: this._owner,
      name: this._name,
    });
  }
}

import { ApiProperty } from '@nestjs/swagger';

import { User } from '../../user/domain/models/user';
import { Project } from '../domain/models/project';

class ProjectOwnerPresenter {
  /**
   * The course owner name.
   */
  @ApiProperty({ example: 'Jane Doe' })
  readonly name: string;

  constructor(owner: User) {
    this.name = owner.name;
    Object.freeze(this);
  }
}

export class ProjectPresenter {
  @ApiProperty({ example: 'Course Platform' })
  name: string;

  @ApiProperty({ example: 'Lorem ipsum dolor si amet.' })
  description: string;

  @ApiProperty({ type: () => ProjectOwnerPresenter })
  owner: ProjectOwnerPresenter;

  constructor(project: Project) {
    this.name = project.name;
    this.description = project.description;
    this.owner = new ProjectOwnerPresenter(project.owner);

    Object.freeze(this);
  }
}

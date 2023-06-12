import { ApiProperty } from '@nestjs/swagger';

import { User } from '../../user/domain/models/user';
import { Project } from '../domain/models/project';

import { v4 } from 'uuid';

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
  /**
   * The unique identifier for the user.
   */
  @ApiProperty({ example: v4() })
  readonly id: string;

  /**
   * The date and time when the user was created.
   */
  @ApiProperty({ example: new Date() })
  readonly createdAt: Date;

  /**
   * The date and time when the user was last updated.
   */
  @ApiProperty({ example: new Date() })
  readonly updatedAt: Date;

  /**
   * The date and time when the user was deleted.
   */
  @ApiProperty({ example: null })
  readonly deletedAt: Date | null;

  @ApiProperty({ example: 'Course Platform' })
  readonly name: string;

  @ApiProperty({ example: 'Lorem ipsum dolor si amet.' })
  readonly description: string;

  @ApiProperty({ type: () => ProjectOwnerPresenter })
  readonly owner: ProjectOwnerPresenter;

  constructor(project: Project) {
    this.id = project.id;
    this.createdAt = project.createdAt;
    this.updatedAt = project.updatedAt;
    this.deletedAt = project.deletedAt;

    this.name = project.name;
    this.description = project.description;
    this.owner = new ProjectOwnerPresenter(project.owner);

    Object.freeze(this);
  }
}

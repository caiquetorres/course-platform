import { ApiProperty } from '@nestjs/swagger';

import { Role } from '../domain/models/role.enum';

import { IUser } from '../domain/interfaces/user.interface';
import { v4 } from 'uuid';

export class UserPresenter {
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
  readonly deletedAt: Date;

  /**
   * The name of the user.
   */
  @ApiProperty({ example: 'Jane Doe' })
  readonly name: string;

  /**
   * The username of the user.
   */
  @ApiProperty({ example: 'janedoe' })
  readonly username: string;

  /**
   * The email address of the user.
   */
  @ApiProperty({ example: 'janedoe@email.com' })
  readonly email: string;

  @ApiProperty({ example: 300 })
  readonly credits: number;

  /**
   * The roles assigned to the user.
   */
  @ApiProperty({ example: [Role.user] })
  readonly permissions: Role[];

  constructor(user: IUser) {
    this.id = user.id;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
    this.deletedAt = user.deletedAt;
    this.name = user.name;
    this.username = user.username.value;
    this.email = user.email.value;
    this.credits = user.credits;
    this.permissions = [...user.roles];

    Object.freeze(this);
  }
}

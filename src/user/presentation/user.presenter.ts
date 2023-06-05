import { ApiProperty } from '@nestjs/swagger';

import { Role } from '../domain/models/role.enum';

import { IUser } from '../domain/interfaces/user.interface';
import { v4 } from 'uuid';

export class UserPresenter {
  @ApiProperty({ example: v4() })
  readonly id: string;

  @ApiProperty({ example: new Date() })
  readonly createdAt: Date;

  @ApiProperty({ example: new Date() })
  readonly updatedAt: Date;

  @ApiProperty({ example: null })
  readonly deletedAt: Date;

  @ApiProperty({ example: 'Jane Doe' })
  readonly name: string;

  @ApiProperty({ example: 'janedoe@email.com' })
  readonly email: string;

  @ApiProperty({ example: 'janedoe' })
  readonly username: string;

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
    this.permissions = [...user.roles];

    Object.freeze(this);
  }
}

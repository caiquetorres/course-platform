import { ApiProperty } from '@nestjs/swagger';
import { Column, Index } from 'typeorm';

import { Role } from '../enums/role.enum';

import { IUser } from '../interfaces/user.interface';
import { Exclude, Expose } from 'class-transformer';

export class User {
  @ApiProperty({ example: 'Jane Doe' })
  @Column({ nullable: false, length: 64 })
  name: string;

  @ApiProperty({ example: 'janedoe' })
  @Index('user_username')
  @Column({ nullable: false, length: 64, unique: true })
  username: string;

  @ApiProperty({ example: 'janedoe@puppy.com' })
  @Index('user_email')
  @Column({ nullable: false, length: 128, unique: true })
  email: string;

  @Exclude()
  @ApiProperty({ example: '123456' })
  @Column({ nullable: false, type: 'text' })
  password: string;

  @ApiProperty({ example: ['user'] })
  @Expose({ name: 'permissions' })
  @Column({ nullable: false, array: true })
  roles: Role[];

  constructor(partial: Partial<IUser>) {
    Object.assign(partial);
  }

  hasRole(role: Role) {
    return this.roles.includes(role);
  }
}

import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index } from 'typeorm';

import { BaseEntity } from '../../common/entities/base.entity';

import { Role } from '../enums/role.enum';

import { IUser } from '../interfaces/user.interface';
import { Exclude, Expose } from 'class-transformer';

@Entity('users')
export class User extends BaseEntity {
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
  @Column({ nullable: false, type: 'simple-array' })
  roles: Role[];

  constructor(partial: Partial<IUser>) {
    super(partial);
  }

  hasRole(role: Role) {
    return this.roles.includes(role);
  }
}

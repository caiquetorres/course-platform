import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index, OneToMany, Relation } from 'typeorm';

import { BaseEntity } from '../../common/entities/base.entity';
import { Enrollment } from '../../course/entities/enrollment.entity';

import { Role } from '../enums/role.enum';

import { IUser } from '../interfaces/user.interface';
import { Exclude, Expose } from 'class-transformer';

@Entity('users')
export class User extends BaseEntity implements IUser {
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
  @Column({ nullable: false, type: 'text' })
  password: string;

  @Exclude()
  @Column({ nullable: false, default: 0 })
  freeCoursesCount: number;

  @ApiProperty({ example: ['user'] })
  @Expose({ name: 'permissions' })
  @Column({ nullable: false, type: 'simple-array' })
  roles: Role[];

  @OneToMany(() => Enrollment, (enrollment) => enrollment.owner)
  enrollments: Relation<Enrollment>[];

  constructor(partial: Partial<IUser>) {
    super();
    Object.assign(this, partial);
  }

  hasRole(role: Role) {
    return this.roles.includes(role);
  }
}

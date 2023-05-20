import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToMany, Relation } from 'typeorm';

import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../user/entities/user.entity';

import { ICourse } from '../interfaces/course.interface';

@Entity('courses')
export class Course extends BaseEntity implements ICourse {
  @ApiProperty({ example: 'Engenharia de Software' })
  @Column({ length: 32, nullable: false })
  name: string;

  @ApiProperty({ example: 0 })
  @Column({ nullable: false })
  price: number;

  @ManyToMany(() => User, (user) => user.courses)
  users: Relation<User>[];

  constructor(partial: Partial<ICourse>) {
    super();
    Object.assign(this, partial);
  }
}

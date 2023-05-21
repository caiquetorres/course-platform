import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, Relation } from 'typeorm';

import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../user/entities/user.entity';

import { ITopic } from '../interfaces/topic.interface';

@Entity('topics')
export class Topic extends BaseEntity implements ITopic {
  @ApiProperty({ example: 'Lorem ipsum dolor si amet.' })
  @Column({ nullable: false })
  title: string;

  @ApiProperty()
  @ManyToOne(() => User, (user) => user.topics)
  owner: Relation<User>;

  constructor(partial: Partial<ITopic>) {
    super();
    Object.assign(this, partial);
  }
}

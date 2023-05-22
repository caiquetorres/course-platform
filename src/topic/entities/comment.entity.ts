import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, Relation } from 'typeorm';

import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../user/entities/user.entity';
import { Topic } from './topic.entity';

import { IComment } from '../interfaces/comment.interface';

@Entity('comments')
export class Comment extends BaseEntity implements IComment {
  @ApiProperty({ example: 'Lorem ipsum dolor si amet.' })
  @Column({ nullable: false })
  text: string;

  @ManyToOne(() => User, (user) => user.comments)
  owner: Relation<User>;

  @ManyToOne(() => Topic, (topic) => topic.comments)
  topic: Relation<Topic>;

  constructor(partial: Partial<IComment>) {
    super();
    Object.assign(this, partial);
  }
}
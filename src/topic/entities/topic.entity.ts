import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, OneToMany, Relation } from 'typeorm';

import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../user/entities/user.entity';
import { Comment } from './comment.entity';

import { ITopic } from '../interfaces/topic.interface';
import { Exclude } from 'class-transformer';

@Entity('topics')
export class Topic extends BaseEntity implements ITopic {
  @ApiProperty({ example: 'Lorem ipsum dolor si amet.' })
  @Column({ nullable: false })
  title: string;

  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, (user) => user.topics)
  owner: Relation<User>;

  @Exclude()
  @OneToMany(() => Comment, (comment) => comment.topic)
  comments: Relation<Comment>[];

  constructor(partial: Partial<ITopic>) {
    super();
    Object.assign(this, partial);
  }
}

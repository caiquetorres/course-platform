import { Column, Entity, ManyToOne, Relation } from 'typeorm';

import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../user/entities/user.entity';
import { Comment } from './comment.entity';

import { IFeedback } from '../interfaces/feedback.interface';
import { Exclude } from 'class-transformer';

@Entity('feedbacks')
export class Feedback extends BaseEntity implements IFeedback {
  @Column({ nullable: false })
  status: boolean;

  @Exclude()
  @ManyToOne(() => User, (user) => user.feedbacks)
  owner: Relation<User>;

  @Exclude()
  @ManyToOne(() => Comment, (comment) => comment.feedbacks)
  comment: Relation<Comment>;

  constructor(partial: Partial<IFeedback>) {
    super();
    Object.assign(this, partial);
  }
}

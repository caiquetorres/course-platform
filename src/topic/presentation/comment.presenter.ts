import { ApiProperty } from '@nestjs/swagger';

import { User } from '../../user/domain/models/user';
import { Comment } from '../domain/models/comment';

import { TopicPresenter } from './topic.presenter';
import { v4 } from 'uuid';

export class CommentOwnerPresenter {
  @ApiProperty({ example: 'Jane Doe' })
  readonly name: string;

  constructor(user: User) {
    this.name = user.name;

    Object.freeze(this);
  }
}

export class CommentPresenter {
  @ApiProperty({ example: v4() })
  readonly id: string;

  @ApiProperty({ example: new Date() })
  readonly createdAt: Date;

  @ApiProperty({ example: new Date() })
  readonly updatedAt: Date;

  @ApiProperty({ example: null })
  readonly deletedAt: Date | null;

  @ApiProperty({ example: 'Nice.' })
  readonly text: string;

  @ApiProperty({ type: () => CommentOwnerPresenter })
  readonly owner: CommentOwnerPresenter;

  @ApiProperty({ type: () => TopicPresenter })
  readonly topic: TopicPresenter;

  constructor(comment: Comment) {
    this.id = comment.id;
    this.createdAt = comment.createdAt;
    this.updatedAt = comment.updatedAt;
    this.deletedAt = comment.deletedAt;

    this.text = comment.text;
    this.owner = new CommentOwnerPresenter(comment.owner);
    this.topic = new TopicPresenter(comment.topic);

    Object.freeze(this);
  }
}

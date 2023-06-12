import { ApiProperty } from '@nestjs/swagger';

import { User } from '../../user/domain/models/user';
import { Topic } from '../domain/models/topic';

import { v4 } from 'uuid';

class TopicOwnerPresenter {
  @ApiProperty({ example: 'Jane Doe' })
  readonly name: string;

  constructor(owner: User) {
    this.name = owner.name;
    Object.freeze(this);
  }
}

export class TopicPresenter {
  /**
   * The unique identifier for the user.
   */
  @ApiProperty({ example: v4() })
  readonly id: string;

  /**
   * The date and time when the user was created.
   */
  @ApiProperty({ example: new Date() })
  readonly createdAt: Date;

  /**
   * The date and time when the user was last updated.
   */
  @ApiProperty({ example: new Date() })
  readonly updatedAt: Date;

  /**
   * The date and time when the user was deleted.
   */
  @ApiProperty({ example: null })
  readonly deletedAt: Date | null;

  @ApiProperty({ example: 'Software Engineering' })
  readonly title: string;

  @ApiProperty({ type: () => TopicOwnerPresenter })
  readonly owner: TopicOwnerPresenter;

  constructor(topic: Topic) {
    this.id = topic.id;
    this.createdAt = topic.createdAt;
    this.updatedAt = topic.updatedAt;
    this.deletedAt = topic.deletedAt;

    this.title = topic.title;
    this.owner = new TopicOwnerPresenter(topic.owner);

    Object.freeze(this);
  }
}

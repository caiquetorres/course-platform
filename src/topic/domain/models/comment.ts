import { User } from '../../../user/domain/models/user';

import { IComment } from '../interfaces/comment.interface';
import { Topic } from './topic';

interface ICommentConstructor {
  id?: string;

  createdAt?: Date;

  updatedAt?: Date;

  deletedAt?: Date | null;

  text: string;

  owner: User;

  topic: Topic;
}

export class Comment implements Readonly<IComment> {
  readonly id: string;

  readonly createdAt: Date;

  readonly updatedAt: Date;

  readonly deletedAt: Date | null;

  readonly text: string;

  readonly owner: User;

  readonly topic: Topic;

  constructor(comment: ICommentConstructor) {
    Object.assign(this, comment);
    Object.freeze(this);
  }
}

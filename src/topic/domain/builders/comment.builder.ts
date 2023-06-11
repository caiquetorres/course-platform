import { User } from '../../../user/domain/models/user';
import { Comment } from '../models/comment';
import { Topic } from '../models/topic';

import { IComment } from '../interfaces/comment.interface';
import { v4 } from 'uuid';

export class CommentBuilder {
  private readonly _comment: Partial<IComment> = {};

  withId(id: string) {
    this._comment.id = id;
    return this;
  }

  withRandomId() {
    this._comment.id = v4();
    return this;
  }

  withText(text: string) {
    this._comment.text = text;
    return this;
  }

  withOwner(owner: User) {
    this._comment.owner = owner;
    return this;
  }

  withTopic(topic: Topic) {
    this._comment.topic = topic;
    return this;
  }

  build() {
    return new Comment(this._comment as Comment);
  }
}

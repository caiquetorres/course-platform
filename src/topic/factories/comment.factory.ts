import { Comment } from '../entities/comment.entity';

import { IUser } from '../../user/interfaces/user.interface';
import { ITopic } from '../interfaces/topic.interface';

export class CommentFactory {
  private _text: string | null = null;

  private _owner: IUser | null = null;

  private _topic: ITopic | null = null;

  withText(text: string) {
    this._text = text;
    return this;
  }

  withOwner(owner: IUser) {
    this._owner = owner;
    return this;
  }

  withTopic(topic: ITopic) {
    this._topic = topic;
    return this;
  }

  build() {
    return new Comment({
      text: this._text,
      owner: this._owner,
      topic: this._topic,
    });
  }
}

import { Feedback } from '../entities/feedback.entity';

import { IUser } from '../../user/interfaces/user.interface';
import { IComment } from '../interfaces/comment.interface';

export class FeedbackFactory {
  private _id: string | null = null;

  private _status: boolean | null = null;

  private _owner: IUser | null = null;

  private _comment: IComment | null = null;

  withId(id: string) {
    this._id = id;
    return this;
  }

  withStatus(status: boolean) {
    this._status = status;
    return this;
  }

  withOwner(owner: IUser) {
    this._owner = owner;
    return this;
  }

  withComment(comment: IComment) {
    this._comment = comment;
    return this;
  }

  build() {
    return new Feedback({
      status: this._status,
      comment: this._comment,
      owner: this._owner,
    });
  }
}

import { Comment } from '../../../src/topic/domain/models/comment';
import { Feedback } from '../../../src/topic/domain/models/feedback';
import { User } from '../../../src/user/domain/models/user';

import { IFeedback } from '../../../src/topic/domain/interfaces/feedback.interface';
import { v4 } from 'uuid';

export class FeedbackBuilder {
  private readonly _feedback: Partial<IFeedback> = {};

  withId(id: string) {
    this._feedback.id = id;
    return this;
  }

  withRandomId() {
    this._feedback.id = v4();
    return this;
  }

  withStatus(status: boolean) {
    this._feedback.status = status;
    return this;
  }

  withOwner(owner: User) {
    this._feedback.owner = owner;
    return this;
  }

  withComment(comment: Comment) {
    this._feedback.comment = comment;
    return this;
  }

  build() {
    return new Feedback(this._feedback as Feedback);
  }
}

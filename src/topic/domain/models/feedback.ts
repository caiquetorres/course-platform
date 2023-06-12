import { User } from '../../../user/domain/models/user';

import { IFeedback } from '../interfaces/feedback.interface';
import { Comment } from './comment';

interface IFeedbackConstructor {
  id?: string;

  createdAt?: Date;

  updatedAt?: Date;

  deletedAt?: Date | null;

  status: boolean;

  owner: User;

  comment: Comment;
}

export class Feedback implements Readonly<IFeedback> {
  readonly id: string;

  readonly createdAt: Date;

  readonly updatedAt: Date;

  readonly deletedAt: Date | null;

  readonly status: boolean;

  readonly owner: User;

  readonly comment: Comment;

  constructor(feedback: IFeedbackConstructor) {
    Object.assign(this, feedback);
    Object.freeze(this);
  }
}

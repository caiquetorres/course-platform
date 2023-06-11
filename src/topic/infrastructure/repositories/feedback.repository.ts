import { User } from '../../../user/domain/models/user';
import { Comment } from '../../domain/models/comment';
import { Feedback } from '../../domain/models/feedback';

export abstract class FeedbackRepository {
  abstract save(feedback: Feedback): Promise<Feedback>;

  abstract findByOwnerAndComment(
    owner: User,
    comment: Comment,
  ): Promise<Feedback | null>;

  abstract countByComment(comment: Comment): Promise<number>;

  abstract remove(feedback: Feedback): Promise<void>;
}

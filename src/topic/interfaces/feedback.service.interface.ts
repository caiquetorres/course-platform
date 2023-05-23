import { User } from '../../user/entities/user.entity';

export interface IFeedbackService {
  like(requestUser: User, topicId: string, commentId: string): Promise<void>;

  likesCount(
    requestUser: User,
    topicId: string,
    commentId: string,
  ): Promise<number>;

  deslike(requestUser: User, topicId: string, commentId: string): Promise<void>;
}

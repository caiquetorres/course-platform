import { IUser } from '../../user/interfaces/user.interface';
import { IComment } from './comment.interface';

export interface IFeedback {
  status: boolean;

  owner: IUser;

  comment: IComment;
}

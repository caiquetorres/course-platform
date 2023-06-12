import { IUser } from '../../../user/domain/interfaces/user.interface';
import { IComment } from './comment.interface';

export interface IFeedback {
  id: string;

  createdAt: Date;

  updatedAt: Date;

  deletedAt: Date | null;

  status: boolean;

  owner: IUser;

  comment: IComment;
}

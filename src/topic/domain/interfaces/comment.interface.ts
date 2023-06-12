import { IUser } from '../../../user/domain/interfaces/user.interface';
import { ITopic } from './topic.interface';

export interface IComment {
  id: string;

  createdAt: Date;

  updatedAt: Date;

  deletedAt: Date | null;

  text: string;

  owner: IUser;

  topic: ITopic;
}

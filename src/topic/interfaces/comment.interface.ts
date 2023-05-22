import { ITopic } from '../../topic/interfaces/topic.interface';
import { IUser } from '../../user/interfaces/user.interface';

export interface IComment {
  text: string;

  owner: IUser;

  topic: ITopic;
}

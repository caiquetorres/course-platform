import { IUser } from '../../../user/domain/interfaces/user.interface';

export interface ITopic {
  id: string;

  createdAt: Date;

  updatedAt: Date;

  deletedAt: Date | null;

  title: string;

  owner: IUser;
}

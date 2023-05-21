import { IBaseEntity } from '../../common/interfaces/base-entity.interface';

import { IUser } from '../../user/interfaces/user.interface';

export interface ITopic extends IBaseEntity {
  title: string;

  owner: IUser;
}

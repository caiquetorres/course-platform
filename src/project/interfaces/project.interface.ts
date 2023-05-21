import { IBaseEntity } from '../../common/interfaces/base-entity.interface';

import { IUser } from '../../user/interfaces/user.interface';

export interface IProject extends IBaseEntity {
  name: string;

  owner: IUser;
}

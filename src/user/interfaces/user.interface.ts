import { IBaseEntity } from '../../common/interfaces/base-entity.interface';

import { Role } from '../enums/role.enum';

export interface IUser extends IBaseEntity {
  name: string;
  username: string;
  email: string;
  password: string;
  roles: Role[];
}

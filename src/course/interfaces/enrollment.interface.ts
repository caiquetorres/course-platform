import { IBaseEntity } from '../../common/interfaces/base-entity.interface';

import { IUser } from '../../user/interfaces/user.interface';
import { ICourse } from './course.interface';

export interface IEnrollment extends IBaseEntity {
  average: number;

  isCompleted: boolean;

  owner: IUser;

  course: ICourse;
}

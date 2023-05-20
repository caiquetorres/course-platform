import { IBaseEntity } from '../../common/interfaces/base-entity.interface';

export interface ICourse extends IBaseEntity {
  name: string;
  price: number;
}

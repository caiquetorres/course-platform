import { IBaseEntity } from './base-entity.interface';

export class ICursor {
  beforeCursor?: string;
  afterCursor?: string;
}

export class IPage<T extends IBaseEntity> {
  data: T[];
  cursor: ICursor;
}

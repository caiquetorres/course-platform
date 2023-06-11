export class ICursor {
  beforeCursor?: string;
  afterCursor?: string;
}

export class IPage<T> {
  data: T[];
  cursor: ICursor;
}

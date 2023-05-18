import { Type } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { IBaseEntity } from '../interfaces/base-entity.interface';

import { ICursor, IPage } from '../interfaces/page.interface';

class CursorDto implements ICursor {
  @ApiProperty({
    example: 'aWQ6MWVhNTg5ZjEtZWQ5ZC00M2E1LTk4YzYtNGZhNTliZjIxNjQ5',
  })
  beforeCursor?: string;

  @ApiProperty({ example: null })
  afterCursor?: string;
}

export function PageDto<T extends IBaseEntity>(type: Type<T>) {
  class P implements IPage<T> {
    @ApiProperty({ type: CursorDto })
    cursor: CursorDto;

    @ApiProperty({
      type,
      isArray: true,
    })
    data: T[];
  }
  return P;
}

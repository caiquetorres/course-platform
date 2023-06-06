import { Type } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { IPage } from '../domain/interfaces/page.interface';

class CursorDto {
  @ApiProperty({
    example: 'aWQ6MWVhNTg5ZjEtZWQ5ZC00M2E1LTk4YzYtNGZhNTliZjIxNjQ5',
  })
  beforeCursor?: string;

  @ApiProperty({ example: null })
  afterCursor?: string;
}

export function PagePresenter<T>(type: Type<T>) {
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

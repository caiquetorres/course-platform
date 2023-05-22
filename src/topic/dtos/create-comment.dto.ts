import { ApiProperty } from '@nestjs/swagger';

import { IComment } from '../interfaces/comment.interface';

export class CreateCommentDto implements Partial<IComment> {
  @ApiProperty({ example: 'Lorem ipsum dolor si amet.' })
  text: string;
}

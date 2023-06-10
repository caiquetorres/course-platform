import { ApiProperty } from '@nestjs/swagger';

import { IsOptional } from 'class-validator';

export class UpdateTopicDto {
  @ApiProperty({ example: 'Software engineering' })
  @IsOptional()
  title?: string;
}

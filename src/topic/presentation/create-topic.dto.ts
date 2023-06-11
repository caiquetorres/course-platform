import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty } from 'class-validator';

export class CreateTopicDto {
  @ApiProperty({ example: 'Software engineering' })
  @IsNotEmpty({ message: 'It is required to send the topic title' })
  title: string;
}

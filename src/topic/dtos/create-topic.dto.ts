import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { ITopic } from '../interfaces/topic.interface';
import {
  IsNotEmpty,
  IsOptional,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateTopicDto implements Partial<ITopic> {
  @ApiProperty({ example: 'My Project' })
  @IsNotEmpty({ message: 'It is required to send the project name' })
  @MinLength(2, {
    message:
      'It is required to send title with length greater than 2 characters',
  })
  @MaxLength(64, {
    message:
      'It is required to send a title with length lower than 64 characters',
  })
  title: string;

  @ApiPropertyOptional({ example: '212946c2-f806-11ed-b67e-0242ac120002' })
  @IsOptional()
  @IsUUID('4', { message: 'It is required to send a valid id' })
  ownerId?: string;
}

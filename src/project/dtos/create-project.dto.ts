import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { IProject } from '../interfaces/project.interface';
import {
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class CreateProjectDto implements Partial<IProject> {
  @ApiProperty({ example: 'My Project' })
  @IsNotEmpty({ message: 'It is required to send the project name' })
  @MinLength(2, {
    message:
      'It is required to send name with length greater than 2 characters',
  })
  @MaxLength(64, {
    message:
      'It is required to send a name with length lower than 64 characters',
  })
  name: string;

  @ApiPropertyOptional({ example: '212946c2-f806-11ed-b67e-0242ac120002' })
  @IsOptional()
  @IsUUID('4', { message: 'It is required to send a valid id' })
  ownerId?: string;
}

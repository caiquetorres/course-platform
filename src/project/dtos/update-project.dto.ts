import { ApiProperty } from '@nestjs/swagger';

import { IProject } from '../interfaces/project.interface';
import { IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class UpdateProjectDto implements Partial<IProject> {
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
}

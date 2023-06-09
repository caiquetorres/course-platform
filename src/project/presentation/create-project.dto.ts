import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({ example: 'Course Platform' })
  @IsNotEmpty({ message: 'It is required to send the project name' })
  name: string;

  @ApiProperty({ example: 'Lorem ipsum dolor si amet.' })
  @IsNotEmpty({ message: 'It is required to send the project description' })
  description: string;
}

import { ApiProperty } from '@nestjs/swagger';

import { IsOptional } from 'class-validator';

export class UpdateProjectDto {
  @ApiProperty({ example: 'Course Platform' })
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'Lorem ipsum dolor si amet.' })
  @IsOptional()
  description?: string;
}

import { ApiPropertyOptional } from '@nestjs/swagger';

import { IsOptional, Min } from 'class-validator';

/**
 * Data transfer object for updating a course.
 */
export class UpdateCourseDto {
  /**
   * The name of the course.
   */
  @ApiPropertyOptional({ example: 'Software Engineering' })
  @IsOptional()
  name?: string;

  /**
   * The price of the course.
   */
  @ApiPropertyOptional({ example: 120.0 })
  @IsOptional()
  @Min(0, { message: 'The price must be greater than 0' })
  price?: number;
}

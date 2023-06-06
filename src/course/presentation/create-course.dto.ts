import { ApiProperty } from '@nestjs/swagger';

import { IsDefined, IsNotEmpty, Min } from 'class-validator';

/**
 * Data transfer object for creating a new course.
 */
export class CreateCourseDto {
  /**
   * The name of the course.
   */
  @ApiProperty({ example: 'Software Engineering' })
  @IsNotEmpty({ message: 'The course name must be defined' })
  name: string;

  /**
   * The price of the course.
   */
  @ApiProperty({ example: 120.0 })
  @IsDefined({ message: 'The price must must be defined' })
  @Min(0, { message: 'The price must be greater than 0' })
  price: number;
}

import { ApiProperty } from '@nestjs/swagger';

import { ICourse } from '../interfaces/course.interface';
import {
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsDefined,
  Min,
} from 'class-validator';

export class CreateCourseDto implements Partial<ICourse> {
  @ApiProperty({ example: 'Software Engineering' })
  @IsNotEmpty({ message: 'It is required to send the course name' })
  @MinLength(2, {
    message:
      'It is required to send name with length greater than 2 characters',
  })
  @MaxLength(32, {
    message:
      'It is required to send a name with length lower than 64 characters',
  })
  name: string;

  @ApiProperty({ example: 0.0 })
  @IsDefined({ message: 'It is required to send the course price' })
  @Min(0, { message: 'It is required to send a value greater than 0' })
  price: number;
}

import { ApiProperty } from '@nestjs/swagger';

import { ICourse } from '../domain/interfaces/course.interface';
import { v4 } from 'uuid';

export class CoursePresenter {
  /**
   * The unique identifier for the course.
   */
  @ApiProperty({ example: v4() })
  readonly id: string;

  /**
   * The date and time when the course was created.
   */
  @ApiProperty({ example: new Date() })
  readonly createdAt: Date;

  /**
   * The date and time when the course was last updated.
   */
  @ApiProperty({ example: new Date() })
  readonly updatedAt: Date;

  /**
   * The date and time when the course was deleted.
   */
  @ApiProperty({ example: null })
  readonly deletedAt: Date;

  /**
   * The name of the course.
   */
  @ApiProperty({ example: 'Software Engineering' })
  readonly name: string;

  /**
   * The price of the course.
   */
  @ApiProperty({ example: 120 })
  readonly price: number;

  constructor(course: ICourse) {
    this.id = course.id;
    this.createdAt = course.createdAt;
    this.updatedAt = course.updatedAt;
    this.deletedAt = course.deletedAt;
    this.name = course.name;
    this.price = course.price.value;

    Object.freeze(this);
  }
}

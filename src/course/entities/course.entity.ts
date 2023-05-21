import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany, Relation } from 'typeorm';

import { BaseEntity } from '../../common/entities/base.entity';
import { Enrollment } from './enrollment.entity';

import { ICourse } from '../interfaces/course.interface';

@Entity('courses')
export class Course extends BaseEntity implements ICourse {
  @ApiProperty({ example: 'Engenharia de Software' })
  @Column({ length: 32, nullable: false })
  name: string;

  @ApiProperty({ example: 0 })
  @Column({ nullable: false })
  price: number;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.course)
  enrollments: Relation<Enrollment>[];

  constructor(partial: Partial<ICourse>) {
    super();
    Object.assign(this, partial);
  }
}

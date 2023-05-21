import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, Relation } from 'typeorm';

import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../user/entities/user.entity';
import { Course } from './course.entity';

import { IEnrollment } from '../interfaces/enrollment.interface';

@Entity('enrollments')
export class Enrollment extends BaseEntity implements IEnrollment {
  @ApiProperty({ example: 7.5 })
  @Column({ nullable: false })
  average: number;

  @ApiProperty({ example: true })
  @Column({ nullable: false })
  isCompleted: boolean;

  @ManyToOne(() => User, (user) => user.enrollments)
  owner: Relation<User>;

  @ManyToOne(() => Course, (course) => course.enrollments)
  course: Relation<Course>;

  constructor(partial: Partial<IEnrollment>) {
    super();
    Object.assign(this, partial);
  }
}

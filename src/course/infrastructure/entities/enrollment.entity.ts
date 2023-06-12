import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Column,
  ManyToOne,
  Relation,
} from 'typeorm';

import { UserEntity } from '../../../user/infrastructure/entities/user.entity';
import { CourseEntity } from './course.entity';

import { Enrollment } from '../../domain/models/enrollment';

import { Average } from '../../domain/value-objects/average';

@Entity('enrollments')
export class EnrollmentEntity {
  /**
   * The unique identifier for the user.
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * The date and time when the user was created.
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * The date and time when the user was last updated.
   */
  @UpdateDateColumn()
  updatedAt: Date;

  /**
   * The date and time when the user was deleted.
   */
  @DeleteDateColumn()
  deletedAt: Date;

  @Column({ nullable: false })
  average: number;

  @Column({ nullable: false })
  isCompleted: boolean;

  @ManyToOne(() => UserEntity, (user) => user.enrollments, {
    eager: true,
    nullable: false,
  })
  owner: Relation<UserEntity>;

  @ManyToOne(() => CourseEntity, (course) => course.enrollments, {
    eager: true,
    nullable: false,
  })
  course: Relation<CourseEntity>;

  toModel() {
    return new Enrollment({
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
      isCompleted: this.isCompleted,
      average: new Average(this.average),
      owner: this.owner.toModel(),
      course: this.course.toModel(),
    });
  }

  static fromModel(enrollment: Enrollment) {
    const entity = new EnrollmentEntity();

    entity.id = enrollment.id;
    entity.createdAt = enrollment.createdAt;
    entity.updatedAt = enrollment.updatedAt;
    entity.deletedAt = enrollment.deletedAt;

    entity.isCompleted = enrollment.isCompleted;
    entity.average = +enrollment.average;
    entity.owner = UserEntity.fromModel(enrollment.owner);
    entity.course = CourseEntity.fromModel(enrollment.course);

    return entity;
  }
}

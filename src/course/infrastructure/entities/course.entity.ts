import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';

import { UserEntity } from '../../../user/infrastructure/entities/user.entity';

import { Course } from '../../domain/models/course';

import { Price } from '../../domain/value-objects/price';

@Entity('courses')
export class CourseEntity {
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

  /**
   * The name of the course.
   */
  @Column({ length: 128, nullable: false })
  name: string;

  /**
   * The price of the course.
   */
  @Column({ nullable: false, default: 0 })
  price: number;

  /**
   * The course owner.
   */
  @ManyToOne(() => UserEntity, (user) => user.courses, { nullable: false })
  owner: Relation<UserEntity>;

  toModel() {
    return new Course({
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
      name: this.name,
      price: new Price(this.price),
      owner: this.owner.toModel(),
    });
  }

  static fromModel(course: Course) {
    const entity = new CourseEntity();

    entity.id = course.id;
    entity.createdAt = course.createdAt;
    entity.updatedAt = course.updatedAt;
    entity.deletedAt = course.deletedAt;

    entity.name = course.name;
    entity.price = +course.price;

    return entity;
  }
}

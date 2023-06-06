import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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
}

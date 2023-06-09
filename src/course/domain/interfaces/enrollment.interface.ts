import { User } from '../../../user/domain/models/user';
import { Course } from '../models/course';

export interface IEnrollment {
  /**
   * The unique identifier for the course.
   */
  id?: string;

  /**
   * The date and time when the course was created.
   */
  createdAt?: Date;

  /**
   * The date and time when the course was last updated.
   */
  updatedAt?: Date;

  /**
   * The date and time when the course was deleted.
   */
  deletedAt?: Date | null;

  average: number;

  isCompleted: boolean;

  owner: User;

  course: Course;
}

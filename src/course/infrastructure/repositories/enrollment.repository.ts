import { User } from '../../../user/domain/models/user';
import { Course } from '../../domain/models/course';
import { Enrollment } from '../../domain/models/enrollment';

export abstract class EnrollmentRepository {
  abstract save(enrollment: Enrollment): Promise<Enrollment>;

  abstract findByOwnerAndCourse(
    owner: User,
    course: Course,
  ): Promise<Enrollment | null>;

  abstract remove(enrollment: Enrollment): Promise<void>;
}

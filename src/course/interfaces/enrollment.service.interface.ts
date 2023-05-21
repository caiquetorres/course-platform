import { User } from '../../user/entities/user.entity';
import { Enrollment } from '../entities/enrollment.entity';

export interface IEnrollmentService {
  enroll(requestUser: User, courseId: string): Promise<Enrollment>;

  withdraw(requestUser: User, courseId: string): Promise<Enrollment>;
}

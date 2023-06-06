import { Course } from '../../domain/models/course';

export abstract class CourseRepository {
  abstract save(course: Course): Promise<Course>;
}

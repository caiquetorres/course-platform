import { Course } from '../../course/entities/course.entity';
import { User } from '../entities/user.entity';

import { PageQuery } from '../../common/classes/page.query';
import { IPage } from '../../common/interfaces/page.interface';

export interface IUserCoursesService {
  /**
   * Finds multiple courses based on the provided query parameters.
   *
   * @param query The query object specifying pagination parameters and
   * filters.
   * @param id The user id.
   * @param requestUser The course making the request.
   * @returns A Promise that resolves to a paginated list of courses.
   * @throws {ForbiddenException} If the course does not have permission to access the resource.
   */
  findMany(
    requestUser: User,
    id: string,
    query: PageQuery,
  ): Promise<IPage<Course>>;
}

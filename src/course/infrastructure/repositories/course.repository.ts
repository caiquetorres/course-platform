import { Course } from '../../domain/models/course';

import { IPage } from '../../../common/domain/interfaces/page.interface';
import { PageQuery } from '../../../common/presentation/page.query';

export abstract class CourseRepository {
  abstract save(course: Course): Promise<Course>;

  abstract findOneById(courseId: string): Promise<Course>;

  abstract findMany(query: PageQuery): Promise<IPage<Course>>;

  abstract findManyByAuthorId(
    authorId: string,
    query: PageQuery,
  ): Promise<IPage<Course>>;

  abstract removeOne(course: Course): Promise<void>;
}

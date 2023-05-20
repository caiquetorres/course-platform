import { User } from '../../user/entities/user.entity';
import { Course } from '../entities/course.entity';

import { CreateCourseDto } from '../dtos/create-course.dto';
import { UpdateCourseDto } from '../dtos/update-course.dto';

import { PageQuery } from '../../common/classes/page.query';
import { IPage } from '../../common/interfaces/page.interface';

export interface ICourseService {
  /**
   * Creates a new course with the given data.
   *
   * @param _requestUser The course who is creating the course.
   * @param dto The data for the new course.
   * @returns A Promise that resolves to the created course.
   * @throws {ConflictException} If a course with the given email or course name
   * already exists.
   */
  createOne(requestUser: User, dto: CreateCourseDto): Promise<Course>;

  /**
   * Finds a course with the given id.
   *
   * @param id The id of the course to find.
   * @returns A Promise that resolves to the found course.
   * @throws {NotFoundException} If no course with the given id is found.
   */
  findOne(requestUser: User, id: string): Promise<Course>;

  /**
   * Finds multiple courses based on the provided query parameters.
   *
   * @param query The query object specifying pagination parameters and
   * filters.
   * @param requestUser The course making the request.
   * @returns A Promise that resolves to a paginated list of courses.
   * @throws {ForbiddenException} If the course does not have permission to access the resource.
   */
  findMany(requestUser: User, query: PageQuery): Promise<IPage<Course>>;

  /**
   * Updates a course with the given ID.
   *
   * @param requestUser The course making the request.
   * @param id The ID of the course to update.
   * @param dto The data to update the course with.
   * @returns A Promise that resolves to the updated course.
   * @throws {NotFoundException} If the course with the given ID does not
   * exist or is disabled.
   * @throws {ForbiddenException} If the course does not have permission to
   * update the resource.
   */
  updateOne(
    requestUser: User,
    id: string,
    dto: UpdateCourseDto,
  ): Promise<Course>;

  /**
   * Removes a course with the given ID.
   *
   * @param requestUser The course making the request.
   * @param id The ID of the course to remove.
   * @returns A Promise that resolves when the course is successfully
   * removed.
   * @throws {NotFoundException} If the course with the given ID does not
   * exist or is disabled.
   * @throws {ForbiddenException} If the course does not have permission to
   * remove the resource.
   */
  deleteOne(requestUser: User, id: string): Promise<Course>;
}

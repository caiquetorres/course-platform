import { User } from '../../user/entities/user.entity';
import { Project } from '../entities/project.entity';

import { CreateProjectDto } from '../dtos/create-project.dto';

import { PageQuery } from '../../common/classes/page.query';
import { IPage } from '../../common/interfaces/page.interface';

export interface IProjectService {
  /**
   * Creates a new project with the given data.
   *
   * @param _requestUser The user who is creating the project.
   * @param dto The data for the new project.
   * @returns A Promise that resolves to the created project.
   * @throws {ForbiddenException} If the user does not have permission to access the resource.
   */
  createOne(requestUser: User, dto: CreateProjectDto): Promise<Project>;

  /**
   * Finds a project with the given id.
   *
   * @param requestUser The user who is finding the project.
   * @param id The id of the project to find.
   * @returns A Promise that resolves to the found project.
   * @throws {NotFoundException} If no project with the given id is found.
   * @throws {ForbiddenException} If the user does not have permission to access the resource.
   */
  findOne(requestUser: User, id: string): Promise<Project>;

  /**
   * Finds multiple projects based on the provided query parameters.
   *
   * @param requestUser The user making the request.
   * @param query The query object specifying pagination parameters and
   * filters.
   * @returns A Promise that resolves to a paginated list of projects.
   * @throws {ForbiddenException} If the user does not have permission to access the resource.
   */
  findMany(requestUser: User, query: PageQuery): Promise<IPage<Project>>;

  /**
   * Updates a project with the given ID.
   *
   * @param requestUser The user making the request.
   * @param id The ID of the project to update.
   * @param dto The data to update the project with.
   * @returns A Promise that resolves to the updated project.
   * @throws {NotFoundException} If the project with the given ID does not
   * exist or is disabled.
   * @throws {ForbiddenException} If the user does not have permission to
   * update the resource.
   */
  updateOne(
    requestUser: User,
    id: string,
    dto: CreateProjectDto,
  ): Promise<Project>;

  /**
   * Removes a project with the given ID.
   *
   * @param requestUser The user making the request.
   * @param id The ID of the project to remove.
   * @returns A Promise that resolves when the project is successfully
   * removed.
   * @throws {NotFoundException} If the project with the given ID does not
   * exist or is disabled.
   * @throws {ForbiddenException} If the user does not have permission to
   * remove the resource.
   */
  deleteOne(requestUser: User, id: string): Promise<Project>;
}

import { User } from '../entities/user.entity';

import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';

import { PageQuery } from '../../common/classes/page.query';
import { IPage } from '../../common/interfaces/page.interface';

export interface IUserService {
  /**
   * Creates a new user with the given data.
   *
   * @param _requestUser The user who is creating the user.
   * @param dto The data for the new user.
   * @returns A Promise that resolves to the created user.
   * @throws {ConflictException} If a user with the given email or username
   * already exists.
   */
  createOne(requestUser: User, dto: CreateUserDto): Promise<User>;

  /**
   * Finds a user with the given id.
   *
   * @param id The id of the user to find.
   * @returns A Promise that resolves to the found user.
   * @throws {NotFoundException} If no user with the given id is found.
   */
  findOne(requestUser: User, id: string): Promise<User>;

  /**
   * Finds multiple users based on the provided query parameters.
   *
   * @param query The query object specifying pagination parameters and
   * filters.
   * @param requestUser The user making the request.
   * @returns A Promise that resolves to a paginated list of users.
   * @throws {ForbiddenException} If the user does not have permission to access the resource.
   */
  findMany(requestUser: User, query: PageQuery): Promise<IPage<User>>;

  /**
   * Updates a user with the given ID.
   *
   * @param requestUser The user making the request.
   * @param id The ID of the user to update.
   * @param dto The data to update the user with.
   * @returns A Promise that resolves to the updated user.
   * @throws {NotFoundException} If the user with the given ID does not
   * exist or is disabled.
   * @throws {ForbiddenException} If the user does not have permission to
   * update the resource.
   */
  updateOne(requestUser: User, id: string, dto: UpdateUserDto): Promise<User>;

  /**
   * Removes a user with the given ID.
   *
   * @param requestUser The user making the request.
   * @param id The ID of the user to remove.
   * @returns A Promise that resolves when the user is successfully
   * removed.
   * @throws {NotFoundException} If the user with the given ID does not
   * exist or is disabled.
   * @throws {ForbiddenException} If the user does not have permission to
   * remove the resource.
   */
  deleteOne(requestUser: User, id: string): Promise<User>;
}

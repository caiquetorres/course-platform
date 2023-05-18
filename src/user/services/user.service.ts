import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsUtils, Repository } from 'typeorm';
import { buildPaginator } from 'typeorm-cursor-pagination';

import { User } from '../entities/user.entity';

import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { Role } from '../enums/role.enum';

import { PageQuery } from '../../common/classes/page.query';
import { IPage } from '../../common/interfaces/page.interface';
import bcryptjs from 'bcryptjs';

/**
 * A service that provides CRUD operations for users.
 */
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly _userRepository: Repository<User>,
  ) {}

  /**
   * Creates a new user with the given data.
   *
   * @param _requestUser The user who is creating the user.
   * @param dto The data for the new user.
   * @returns A Promise that resolves to the created user.
   * @throws {ConflictException} If a user with the given email or username
   * already exists.
   */
  async createOne(_requestUser: User, dto: CreateUserDto) {
    const hasWithEmail = await this._hasWithEmail(dto.email);
    if (hasWithEmail) {
      throw new ConflictException(
        `The user with the email '${dto.email}' already exists`,
      );
    }

    const hasWithUsername = await this._hasWithUsername(dto.username);
    if (hasWithUsername) {
      throw new ConflictException(
        `The user with the username '${dto.email}' already exists`,
      );
    }

    const user = new User({
      ...dto,
      roles: [Role.user],
      password: await this._encryptPassword(dto.password),
    });

    return this._userRepository.save(user);
  }

  /**
   * Finds a user with the given id.
   *
   * @param id The id of the user to find.
   * @returns A Promise that resolves to the found user.
   * @throws {NotFoundException} If no user with the given id is found.
   */
  async findOne(requestUser: User, id: string) {
    const find = async () => {
      const user = await this._userRepository.findOneBy({ id });

      if (!user) {
        throw new NotFoundException(`User with id '${id}' not found`);
      }

      return user;
    };

    if (requestUser.hasRole(Role.admin)) {
      return find();
    }

    if (requestUser.id === id) {
      return find();
    }

    throw new ForbiddenException(
      'You do not have permission to access this resource',
    );
  }

  /**
   * Finds multiple users based on the provided query parameters.
   *
   * @param query The query object specifying pagination parameters and
   * filters.
   * @param requestUser The user making the request.
   * @returns A Promise that resolves to a paginated list of users.
   * @throws {ForbiddenException} If the user does not have permission to access the resource.
   */
  findMany(query: PageQuery, requestUser: User): Promise<IPage<User>> {
    const find = () => {
      const paginator = buildPaginator({
        entity: User,
        alias: 'users',
        paginationKeys: ['id'],
        query,
      });

      const queryBuilder = this._userRepository.createQueryBuilder('users');

      FindOptionsUtils.joinEagerRelations(
        queryBuilder,
        queryBuilder.alias,
        this._userRepository.metadata,
      );

      return paginator.paginate(queryBuilder);
    };

    if (requestUser.hasRole(Role.admin)) {
      return find();
    }

    throw new ForbiddenException(
      'You do not have permissions to access these sources',
    );
  }

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
  async updateOne(requestUser: User, id: string, dto: UpdateUserDto) {
    const update = async () => {
      const user = await this._userRepository.findOne({ where: { id } });

      if (!user) {
        throw new NotFoundException(
          `The user identified by '${id}' does not exist or is disabled`,
        );
      }

      return this._userRepository.save(new User({ ...user, ...dto }));
    };

    if (requestUser.hasRole(Role.admin)) {
      return update();
    }

    if (requestUser.id === id) {
      return update();
    }

    throw new ForbiddenException(
      'You do not have permissions to access these sources',
    );
  }

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
  async deleteOne(requestUser: User, id: string) {
    const remove = async () => {
      const user = await this._userRepository.findOneBy({ id });

      if (!user) {
        throw new NotFoundException(
          `The user identified by '${id}' does not exist or is disabled`,
        );
      }

      return this._userRepository.remove(user);
    };

    if (requestUser.hasRole(Role.admin)) {
      return remove();
    }

    if (requestUser.id === id) {
      return remove();
    }

    throw new ForbiddenException(
      'You do not have permissions to access these sources',
    );
  }

  /**
   * Checks if a user with the given email already exists in the
   * database.
   *
   * @param email The email to search for.
   * @returns A Promise that resolves to a boolean value indicating
   * whether or not a user with the given email exists in the database.
   */
  private async _hasWithEmail(email: string) {
    return this._userRepository
      .findOne({ where: { email } })
      .then((user) => !!user);
  }

  /**
   * Checks if a user with the given username already exists in the
   * database.
   *
   * @param username The username to search for.
   * @returns A Promise that resolves to a boolean value indicating
   * whether or not a user with the given username exists in the database.
   */
  private async _hasWithUsername(username: string) {
    return this._userRepository
      .findOne({ where: { username } })
      .then((user) => !!user);
  }

  /**
   * Method that encrypts the password.
   *
   * @param password defines the password that will be encrypted.
   * @returns the encrypted password.
   */
  private async _encryptPassword(password: string): Promise<string> {
    const salt = await bcryptjs.genSalt();
    return bcryptjs.hash(password, salt);
  }
}

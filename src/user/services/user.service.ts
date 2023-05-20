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

import { IUserService } from '../interfaces/user.service.interface';

import { PageQuery } from '../../common/classes/page.query';
import { IPage } from '../../common/interfaces/page.interface';
import { UserFactory } from '../factories/user.factory';
import { Email } from '../value-objects/email';
import { Password } from '../value-objects/password';

/**
 * A service that provides CRUD operations for users.
 */
@Injectable()
export class UserService implements IUserService {
  constructor(
    @InjectRepository(User)
    private readonly _userRepository: Repository<User>,
  ) {}

  /**
   * @inheritdoc
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

    const { name, username, email, password } = dto;

    const user = new UserFactory()
      .withName(name)
      .withUsername(username)
      .withEmail(new Email(email))
      .withPassword(new Password(password))
      .asUser()
      .build();

    return this._userRepository.save(user);
  }

  /**
   * @inheritdoc
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
   * @inheritdoc
   */
  findMany(requestUser: User, query: PageQuery): Promise<IPage<User>> {
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
   * @inheritdoc
   */
  async updateOne(requestUser: User, id: string, dto: UpdateUserDto) {
    const update = async () => {
      let user = await this._userRepository.findOne({ where: { id } });

      if (!user) {
        throw new NotFoundException(
          `The user identified by '${id}' does not exist or is disabled`,
        );
      }

      user = new UserFactory()
        .from({ ...user })
        .withName(dto.name)
        .build();

      return this._userRepository.save(user);
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
   * @inheritdoc
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
}

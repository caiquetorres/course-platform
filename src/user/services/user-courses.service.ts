import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsUtils } from 'typeorm';
import { buildPaginator } from 'typeorm-cursor-pagination';

import { Course } from '../../course/entities/course.entity';
import { User } from '../entities/user.entity';

import { Role } from '../enums/role.enum';

import { PageQuery } from '../../common/classes/page.query';
import { IUserCoursesService } from '../interfaces/user-courses.interface';

@Injectable()
export class UserCoursesService implements IUserCoursesService {
  constructor(
    @InjectRepository(User)
    private readonly _userRepository: Repository<User>,
    @InjectRepository(Course)
    private readonly _courseRepository: Repository<Course>,
  ) {}

  findMany(requestUser: User, id: string, query: PageQuery) {
    const find = () => {
      const paginator = buildPaginator({
        entity: Course,
        alias: 'courses',
        paginationKeys: ['id'],
        query,
      });

      const queryBuilder = this._courseRepository
        .createQueryBuilder('courses')
        .innerJoin('courses.users', 'user')
        .where('user.id = :id', { id });

      FindOptionsUtils.joinEagerRelations(
        queryBuilder,
        queryBuilder.alias,
        this._courseRepository.metadata,
      );

      return paginator.paginate(queryBuilder);
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
}

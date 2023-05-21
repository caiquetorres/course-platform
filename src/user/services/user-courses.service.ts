import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsUtils } from 'typeorm';
import { buildPaginator } from 'typeorm-cursor-pagination';

import { Enrollment } from '../../course/entities/enrollment.entity';
import { User } from '../entities/user.entity';

import { Role } from '../enums/role.enum';

import { PageQuery } from '../../common/classes/page.query';
import { IUserCoursesService } from '../interfaces/user-courses.interface';

@Injectable()
export class UserCoursesService implements IUserCoursesService {
  constructor(
    @InjectRepository(User)
    private readonly _userRepository: Repository<User>,
    @InjectRepository(Enrollment)
    private readonly _enrollmentRepository: Repository<Enrollment>,
  ) {}

  async findMany(requestUser: User, id: string, query: PageQuery) {
    const find = async () => {
      const paginator = buildPaginator({
        entity: Enrollment,
        alias: 'enrollment',
        paginationKeys: ['id'],
        query,
      });

      const queryBuilder = this._enrollmentRepository
        .createQueryBuilder('enrollment')
        .innerJoin('enrollment.user', 'user')
        .where('user.id = :id', { id });

      FindOptionsUtils.joinEagerRelations(
        queryBuilder,
        queryBuilder.alias,
        this._enrollmentRepository.metadata,
      );

      const { cursor, data } = await paginator.paginate(queryBuilder);

      return {
        cursor,
        data: data.map((enrollment) => enrollment.course),
      };
    };

    if (requestUser.hasRole(Role.admin)) {
      return find();
    }

    const user = await this._userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User with id '${id}' not found`);
    }

    if (requestUser.id === id) {
      return find();
    }

    throw new ForbiddenException(
      'You do not have permission to access this resource',
    );
  }
}

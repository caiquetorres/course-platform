import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsUtils, Repository } from 'typeorm';
import { buildPaginator } from 'typeorm-cursor-pagination';

import { User } from '../../user/entities/user.entity';
import { Course } from '../entities/course.entity';

import { Role } from '../../user/enums/role.enum';
import { CreateCourseDto } from '../dtos/create-course.dto';
import { UpdateCourseDto } from '../dtos/update-course.dto';

import { ICourseService } from '../interfaces/course.service.interface';

import { PageQuery } from '../../common/classes/page.query';
import { IPage } from '../../common/interfaces/page.interface';
import { CourseFactory } from '../factories/course.factory';
import { Price } from '../value-objects/price';

@Injectable()
export class CourseService implements ICourseService {
  constructor(
    @InjectRepository(Course)
    private readonly _courseRepository: Repository<Course>,
  ) {}

  /**
   * @inheritdoc
   */
  createOne(requestUser: User, dto: CreateCourseDto): Promise<Course> {
    const create = () => {
      const course = new CourseFactory()
        .withName(dto.name)
        .withPrice(new Price(dto.price))
        .build();

      delete course.id;
      return this._courseRepository.save(course);
    };

    if (requestUser.hasRole(Role.admin)) {
      return create();
    }

    throw new ForbiddenException(
      'You do not have permission to access this resource',
    );
  }

  /**
   * @inheritdoc
   */
  findOne(_requestUser: User, id: string): Promise<Course> {
    const find = async () => {
      const course = await this._courseRepository.findOneBy({ id });

      if (!course) {
        throw new NotFoundException(`Course with id '${id}' not found`);
      }

      return course;
    };

    return find();
  }

  /**
   * @inheritdoc
   */
  findMany(_requestUser: User, query: PageQuery): Promise<IPage<Course>> {
    const find = () => {
      const paginator = buildPaginator({
        entity: Course,
        alias: 'courses',
        paginationKeys: ['id'],
        query,
      });

      const queryBuilder = this._courseRepository.createQueryBuilder('courses');

      FindOptionsUtils.joinEagerRelations(
        queryBuilder,
        queryBuilder.alias,
        this._courseRepository.metadata,
      );

      return paginator.paginate(queryBuilder);
    };

    return find();
  }

  /**
   * @inheritdoc
   */
  updateOne(
    requestUser: User,
    id: string,
    dto: UpdateCourseDto,
  ): Promise<Course> {
    const update = async () => {
      let course = await this._courseRepository.findOne({ where: { id } });

      if (!course) {
        throw new NotFoundException(`Course with id '${id}' not found`);
      }

      course = new CourseFactory()
        .from(course)
        .withName(dto.name)
        .withPrice(new Price(dto.price))
        .build();

      return this._courseRepository.save(course);
    };

    if (requestUser.hasRole(Role.admin)) {
      return update();
    }

    throw new ForbiddenException(
      'You do not have permissions to access these sources',
    );
  }

  /**
   * @inheritdoc
   */
  deleteOne(requestUser: User, id: string): Promise<Course> {
    const remove = async () => {
      const course = await this._courseRepository.findOneBy({ id });

      if (!course) {
        throw new NotFoundException(`Course with id '${id}' not found`);
      }

      return this._courseRepository.remove(course);
    };

    if (requestUser.hasRole(Role.admin)) {
      return remove();
    }

    throw new ForbiddenException(
      'You do not have permissions to access these sources',
    );
  }
}

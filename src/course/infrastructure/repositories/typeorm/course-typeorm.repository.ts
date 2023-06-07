import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsUtils, Repository } from 'typeorm';
import { buildPaginator } from 'typeorm-cursor-pagination';

import { CourseEntity } from '../../entities/course.entity';

import { Course } from '../../../domain/models/course';

import { IPage } from '../../../../common/domain/interfaces/page.interface';
import { PageQuery } from '../../../../common/presentation/page.query';
import { CourseRepository } from '../course.repository';

@Injectable()
export class CourseTypeOrmRepository extends CourseRepository {
  constructor(
    @InjectRepository(CourseEntity)
    private readonly _repository: Repository<CourseEntity>,
  ) {
    super();
  }

  override async save(course: Course): Promise<Course> {
    let entity = CourseEntity.fromModel(course);
    entity = await this._repository.save(entity);
    return entity.toModel();
  }

  override async findOneById(id: string): Promise<Course> {
    const entity = await this._repository.findOneBy({ id });
    return entity ? entity.toModel() : null;
  }

  override async findMany(query: PageQuery): Promise<IPage<Course>> {
    const paginator = buildPaginator({
      entity: CourseEntity,
      alias: 'courses',
      paginationKeys: ['id'],
      query,
    });

    const queryBuilder = this._repository.createQueryBuilder('courses');

    FindOptionsUtils.joinEagerRelations(
      queryBuilder,
      queryBuilder.alias,
      this._repository.metadata,
    );

    const page = await paginator.paginate(queryBuilder);
    return {
      cursor: page.cursor,
      data: page.data.map((entity) => entity.toModel()),
    };
  }
}

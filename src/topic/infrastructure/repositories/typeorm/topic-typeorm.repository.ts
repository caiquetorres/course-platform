import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsUtils, Repository } from 'typeorm';
import { buildPaginator } from 'typeorm-cursor-pagination';

import { TopicEntity } from '../../entities/topic.entity';

import { Topic } from '../../../domain/models/topic';

import { IPage } from '../../../../common/domain/interfaces/page.interface';
import { PageQuery } from '../../../../common/presentation/page.query';
import { TopicRepository } from '../topic.repository';

@Injectable()
export class TopicTypeOrmRepository extends TopicRepository {
  constructor(
    @InjectRepository(TopicEntity)
    private readonly _repository: Repository<TopicEntity>,
  ) {
    super();
  }

  override async save(topic: Topic): Promise<Topic> {
    let entity = TopicEntity.fromModel(topic);
    entity = await this._repository.save(entity);
    return entity.toModel();
  }

  override async findOneById(id: string): Promise<Topic> {
    const entity = await this._repository.findOneBy({ id });
    return entity ? entity.toModel() : null;
  }

  override async findMany(query: PageQuery): Promise<IPage<Topic>> {
    const paginator = buildPaginator({
      entity: TopicEntity,
      alias: 'topics',
      paginationKeys: ['id'],
      query,
    });

    const queryBuilder = this._repository.createQueryBuilder('topics');

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

  override async remove(topic: Topic): Promise<void> {
    const entity = TopicEntity.fromModel(topic);
    await this._repository.remove(entity);
  }
}

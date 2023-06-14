import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsUtils, Repository } from 'typeorm';
import { buildPaginator } from 'typeorm-cursor-pagination';

import { CommentEntity } from '../../entities/comment.entity';

import { Comment } from '../../../domain/models/comment';
import { Topic } from '../../../domain/models/topic';

import { IPage } from '../../../../common/domain/interfaces/page.interface';
import { PageQuery } from '../../../../common/presentation/page.query';
import { CommentRepository } from '../comment.repository';

@Injectable()
export class CommentTypeOrmRepository extends CommentRepository {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly _repository: Repository<CommentEntity>,
  ) {
    super();
  }

  override async save(comment: Comment): Promise<Comment> {
    let entity = CommentEntity.fromModel(comment);
    entity = await this._repository.save(entity);
    return entity.toModel();
  }

  override async findOneById(id: string): Promise<Comment> {
    const entity = await this._repository.findOneBy({ id });
    return entity ? entity.toModel() : null;
  }

  override async findManyByTopic(
    topic: Topic,
    query: PageQuery,
  ): Promise<IPage<Comment>> {
    const paginator = buildPaginator({
      entity: CommentEntity,
      alias: 'comments',
      paginationKeys: ['id'],
      query,
    });

    const queryBuilder = this._repository
      .createQueryBuilder('comments')
      .where('comments.topicId = :topicId', { topicId: topic.id });

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

  override async remove(comment: Comment): Promise<void> {
    const entity = CommentEntity.fromModel(comment);
    await this._repository.remove(entity);
  }
}

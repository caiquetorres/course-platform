import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsUtils, Repository } from 'typeorm';
import { buildPaginator } from 'typeorm-cursor-pagination';

import { User } from '../../user/entities/user.entity';
import { Comment } from '../entities/comment.entity';
import { Topic } from '../entities/topic.entity';

import { Role } from '../../user/enums/role.enum';
import { CreateCommentDto } from '../dtos/create-comment.dto';

import { PageQuery } from '../../common/classes/page.query';
import { CommentFactory } from '../factories/comment.factory';

export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly _commentRepository: Repository<Comment>,
    @InjectRepository(Topic)
    private readonly _topicRepository: Repository<Topic>,
  ) {}

  async createOne(requestUser: User, topicId: string, dto: CreateCommentDto) {
    const topic = await this._topicRepository.findOneBy({ id: topicId });

    if (!topic) {
      throw new NotFoundException(`Topic with id '${topicId}' not found`);
    }

    validations: {
      if (requestUser.hasRole(Role.guest)) {
        break validations;
      }

      const comment = new CommentFactory()
        .withText(dto.text)
        .withOwner(requestUser)
        .withTopic(topic)
        .build();

      return this._commentRepository.save(comment);
    }

    throw new ForbiddenException(
      'You do not have permission to access this resource',
    );
  }

  async findOne(_requestUser: User, topicId: string, commentId: string) {
    const topic = await this._topicRepository.findOneBy({ id: topicId });

    if (!topic) {
      throw new NotFoundException(`Topic with id '${topicId}' not found`);
    }

    const comment = await this._commentRepository.findOne({
      where: { id: commentId },
      relations: ['owner'],
    });

    if (!comment) {
      throw new NotFoundException(`Comment with id '${commentId}' not found`);
    }

    return comment;
  }

  async findMany(_requestUser: User, topicId: string, query: PageQuery) {
    const paginator = buildPaginator({
      entity: Comment,
      alias: 'comments',
      paginationKeys: ['id'],
      query,
    });

    const queryBuilder = this._commentRepository
      .createQueryBuilder('comments')
      .innerJoin('comments.topic', 'topic')
      .where('topic.ic = :id', { id: topicId });

    FindOptionsUtils.joinEagerRelations(
      queryBuilder,
      queryBuilder.alias,
      this._commentRepository.metadata,
    );

    return paginator.paginate(queryBuilder);
  }

  async deleteOne(requestUser: User, topicId: string, commentId: string) {
    const topic = await this._topicRepository.findOneBy({ id: topicId });

    if (!topic) {
      throw new NotFoundException(`Topic with id '${topicId}' not found`);
    }

    const comment = await this._commentRepository.findOne({
      where: { id: commentId },
      relations: ['owner'],
    });

    if (!comment) {
      throw new NotFoundException(`Comment with id '${commentId}' not found`);
    }

    validations: {
      if (requestUser.hasRole(Role.guest)) {
        break validations;
      }

      if (comment.owner.id !== requestUser.id) {
        break validations;
      }

      return this._commentRepository.remove(comment);
    }

    throw new ForbiddenException(
      'You do not have permission to access this resource',
    );
  }
}

import { HttpException, Injectable, NotFoundException } from '@nestjs/common';

import { User } from '../../user/domain/models/user';
import { Comment } from '../domain/models/comment';

import { Either, Left, Right } from '../../common/domain/classes/either';
import { IPage } from '../../common/domain/interfaces/page.interface';
import { PageQuery } from '../../common/presentation/page.query';
import { CommentRepository } from '../infrastructure/repositories/comment.repository';
import { TopicRepository } from '../infrastructure/repositories/topic.repository';

@Injectable()
export class FindManyCommentsUseCase {
  constructor(
    private readonly _commentRepository: CommentRepository,
    private readonly _topicRepository: TopicRepository,
  ) {}

  async find(
    _requestUser: User,
    topicId: string,
    pageQuery: PageQuery,
  ): Promise<Either<HttpException, IPage<Comment>>> {
    const topic = await this._topicRepository.findOneById(topicId);

    if (!topic) {
      return new Left(
        new NotFoundException(`Topic with id '${topicId}' not found`),
      );
    }

    const page = await this._commentRepository.findManyByTopic(
      topic,
      pageQuery,
    );

    return new Right(page);
  }
}

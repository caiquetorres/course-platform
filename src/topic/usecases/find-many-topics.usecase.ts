import { HttpException, Injectable } from '@nestjs/common';

import { User } from '../../user/domain/models/user';
import { Topic } from '../domain/models/topic';

import { Either, Right } from '../../common/domain/classes/either';
import { IPage } from '../../common/domain/interfaces/page.interface';
import { PageQuery } from '../../common/presentation/page.query';
import { TopicRepository } from '../infrastructure/repositories/topic.repository';

@Injectable()
export class FindManyTopicsUseCase {
  constructor(private readonly _topicRepository: TopicRepository) {}

  async find(
    _requestUser: User,
    pageQuery: PageQuery,
  ): Promise<Either<HttpException, IPage<Topic>>> {
    const topics = await this._topicRepository.findMany(pageQuery);
    return new Right(topics);
  }
}

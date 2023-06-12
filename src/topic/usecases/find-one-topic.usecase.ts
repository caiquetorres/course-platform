import { HttpException, Injectable, NotFoundException } from '@nestjs/common';

import { User } from '../../user/domain/models/user';
import { Topic } from '../domain/models/topic';

import { Either, Left, Right } from '../../common/domain/classes/either';
import { TopicRepository } from '../infrastructure/repositories/topic.repository';

@Injectable()
export class FindOneTopicUseCase {
  constructor(private readonly _topicRepository: TopicRepository) {}

  async find(
    _requestUser: User,
    topicId: string,
  ): Promise<Either<HttpException, Topic>> {
    const topic = await this._topicRepository.findOneById(topicId);

    if (!topic) {
      return new Left(
        new NotFoundException(
          `The topic identified by '${topicId}' was not found`,
        ),
      );
    }

    return new Right(topic);
  }
}

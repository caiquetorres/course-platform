import { ForbiddenException, HttpException, Injectable } from '@nestjs/common';

import { Role } from '../../user/domain/models/role.enum';
import { User } from '../../user/domain/models/user';
import { Topic } from '../domain/models/topic';
import { CreateTopicDto } from '../presentation/create-topic.dto';

import { Either, Left, Right } from '../../common/domain/classes/either';
import { TopicRepository } from '../infrastructure/repositories/topic.repository';

@Injectable()
export class CreateTopicUseCase {
  constructor(private readonly _topicRepository: TopicRepository) {}

  async create(
    requestUser: User,
    dto: CreateTopicDto,
  ): Promise<Either<HttpException, Topic>> {
    if (requestUser.hasRole(Role.guest)) {
      return new Left(
        new ForbiddenException('You do not have permissions to create topics'),
      );
    }

    const topic = await this._topicRepository.save(
      new Topic({
        owner: requestUser,
        title: dto.title,
      }),
    );
    return new Right(topic);
  }
}

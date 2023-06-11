import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Role } from '../../user/domain/models/role.enum';
import { User } from '../../user/domain/models/user';
import { Topic } from '../domain/models/topic';
import { UpdateTopicDto } from '../presentation/update-topic.dto';

import { Left, Right } from '../../common/domain/classes/either';
import { TopicRepository } from '../infrastructure/repositories/topic.repository';

@Injectable()
export class UpdateTopicUseCase {
  constructor(private readonly _topicRepository: TopicRepository) {}

  async update(requestUser: User, topicId: string, dto: UpdateTopicDto) {
    let topic = await this._topicRepository.findOneById(topicId);

    if (!topic) {
      return new Left(
        new NotFoundException(
          `The topic identified by '${topicId}' was not found`,
        ),
      );
    }

    if (!this._canUpdate(requestUser, topic)) {
      return new Left(
        new ForbiddenException(
          'You do not have permissions to update this topic',
        ),
      );
    }

    topic = new Topic({
      ...topic,
      title: dto.title,
    });
    topic = await this._topicRepository.save(topic);

    return new Right(topic);
  }

  private _canUpdate(user: User, topic: Topic) {
    if (user.hasRole(Role.admin)) {
      return true;
    }

    if (user.owns(topic)) {
      return true;
    }

    return false;
  }
}

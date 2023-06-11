import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Role } from '../../user/domain/models/role.enum';
import { User } from '../../user/domain/models/user';
import { Topic } from '../domain/models/topic';

import { Left, Right } from '../../common/domain/classes/either';
import { TopicRepository } from '../infrastructure/repositories/topic.repository';

@Injectable()
export class DeleteTopicUseCase {
  constructor(private readonly _topicRepository: TopicRepository) {}

  async delete(requestUser: User, topicId: string) {
    const topic = await this._topicRepository.findOneById(topicId);

    if (!topic) {
      return new Left(
        new NotFoundException(
          `The topic identified by '${topicId}' was not found`,
        ),
      );
    }

    if (!this._canDelete(requestUser, topic)) {
      return new Left(
        new ForbiddenException(
          'You do not have permissions to update this topic',
        ),
      );
    }

    await this._topicRepository.remove(topic);
    return new Right(void 0);
  }

  private _canDelete(user: User, topic: Topic) {
    if (user.hasRole(Role.admin)) {
      return true;
    }

    if (user.owns(topic)) {
      return true;
    }

    return false;
  }
}

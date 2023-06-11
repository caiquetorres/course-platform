import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FeedbackEntity } from '../../entities/feedback.entity';

import { User } from '../../../../user/domain/models/user';
import { Comment } from '../../../domain/models/comment';
import { Feedback } from '../../../domain/models/feedback';

import { FeedbackRepository } from '../feedback.repository';

@Injectable()
export class FeedbackTypeOrmRepository extends FeedbackRepository {
  constructor(
    @InjectRepository(FeedbackEntity)
    private readonly _repository: Repository<FeedbackEntity>,
  ) {
    super();
  }

  override async save(feedback: Feedback): Promise<Feedback> {
    let entity = FeedbackEntity.fromModel(feedback);
    entity = await this._repository.save(entity);
    return entity.toModel();
  }

  override async findByOwnerAndComment(
    owner: User,
    comment: Comment,
  ): Promise<Feedback> {
    const entity = await this._repository.findOneBy({
      owner: { id: owner.id },
      comment: { id: comment.id },
    });
    return entity ? entity.toModel() : null;
  }

  override async countByComment(comment: Comment): Promise<number> {
    const count = await this._repository.countBy({
      comment: { id: comment.id },
    });
    return count;
  }

  override async remove(feedback: Feedback): Promise<void> {
    const entity = FeedbackEntity.fromModel(feedback);
    await this._repository.remove(entity);
  }
}

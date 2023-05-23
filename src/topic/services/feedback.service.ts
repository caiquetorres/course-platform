import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../../user/entities/user.entity';
import { Comment } from '../entities/comment.entity';
import { Feedback } from '../entities/feedback.entity';
import { Topic } from '../entities/topic.entity';

import { Role } from '../../user/enums/role.enum';

import { IFeedbackService } from '../interfaces/feedback.service.interface';

import { FeedbackFactory } from '../factories/feedback.factory';

@Injectable()
export class FeedbackService implements IFeedbackService {
  constructor(
    @InjectRepository(Feedback)
    private readonly _feedbackRepository: Repository<Feedback>,
    @InjectRepository(Topic)
    private readonly _topicRepository: Repository<Topic>,
    @InjectRepository(Comment)
    private readonly _commentRepository: Repository<Comment>,
  ) {}

  async like(
    requestUser: User,
    topicId: string,
    commentId: string,
  ): Promise<void> {
    await this._findTopicByIdOrThrow(topicId);
    const comment = await this._findCommentByIdOrThrow(commentId);

    validations: {
      if (!requestUser.hasRole(Role.guest)) {
        break validations;
      }

      throw new ForbiddenException(
        'You do not have permissions to access these sources',
      );
    }

    let feedback = await this._feedbackRepository.findOne({
      where: {
        comment: { id: commentId },
        owner: { id: requestUser.id },
      },
      relations: ['comment', 'owner'],
    });

    if (feedback) {
      return;
    }

    feedback = new FeedbackFactory()
      .withStatus(true)
      .withOwner(requestUser)
      .withComment(comment)
      .build();

    await this._feedbackRepository.save(feedback);
  }

  async likesCount(_requestUser: User, topicId: string, commentId: string) {
    await this._findTopicByIdOrThrow(topicId);
    const comment = await this._findCommentByIdOrThrow(commentId);

    return this._feedbackRepository.count({
      where: { comment: { id: comment.id } },
      relations: ['comment'],
    });
  }

  async deslike(
    requestUser: User,
    topicId: string,
    commentId: string,
  ): Promise<void> {
    await this._findTopicByIdOrThrow(topicId);
    await this._findCommentByIdOrThrow(commentId);

    const feedback = await this._feedbackRepository.findOne({
      where: {
        comment: { id: commentId },
        owner: { id: requestUser.id },
      },
      relations: ['comment', 'owner'],
    });

    validations: {
      // The user is neither the guest nor the owner of the feedback
      if (
        !requestUser.hasRole(Role.guest) &&
        feedback.owner.id === requestUser.id
      ) {
        break validations;
      }

      throw new ForbiddenException(
        'You do not have permissions to access these sources',
      );
    }

    if (feedback) {
      return;
    }

    await this._feedbackRepository.remove(feedback);
  }

  private async _findCommentByIdOrThrow(commentId: string) {
    const comment = await this._commentRepository.findOne({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException(`Comment with id '${commentId}' not found`);
    }

    return comment;
  }

  private async _findTopicByIdOrThrow(topicId: string) {
    const topic = await this._topicRepository.findOne({
      where: { id: topicId },
    });

    if (!topic) {
      throw new NotFoundException(`Topic with id '${topicId}' not found`);
    }

    return topic;
  }
}

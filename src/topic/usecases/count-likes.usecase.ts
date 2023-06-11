import { HttpException, Injectable, NotFoundException } from '@nestjs/common';

import { User } from '../../user/domain/models/user';

import { Either, Left, Right } from '../../common/domain/classes/either';
import { CommentRepository } from '../infrastructure/repositories/comment.repository';
import { FeedbackRepository } from '../infrastructure/repositories/feedback.repository';

@Injectable()
export class CountLikesUseCase {
  constructor(
    private readonly _feedbackRepository: FeedbackRepository,
    private readonly _commentRepository: CommentRepository,
  ) {}

  async count(
    _requestUser: User,
    commentId: string,
  ): Promise<Either<HttpException, number>> {
    const comment = await this._commentRepository.findOneById(commentId);

    if (!comment) {
      return new Left(
        new NotFoundException(
          `The comment identified by '${commentId}' was not found`,
        ),
      );
    }

    const count = await this._feedbackRepository.countByComment(comment);
    return new Right(count);
  }
}

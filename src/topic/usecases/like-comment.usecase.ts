import {
  ForbiddenException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Role } from '../../user/domain/models/role.enum';
import { User } from '../../user/domain/models/user';
import { Feedback } from '../domain/models/feedback';

import { Either, Left, Right } from '../../common/domain/classes/either';
import { CommentRepository } from '../infrastructure/repositories/comment.repository';
import { FeedbackRepository } from '../infrastructure/repositories/feedback.repository';

@Injectable()
export class LikeCommentUseCase {
  constructor(
    private readonly _feedbackRepository: FeedbackRepository,
    private readonly _commentRepository: CommentRepository,
  ) {}

  async like(
    requestUser: User,
    commentId: string,
  ): Promise<Either<HttpException, void>> {
    if (requestUser.hasRole(Role.guest)) {
      return new Left(
        new ForbiddenException(
          'You do not have permissions to create feedbacks',
        ),
      );
    }

    const comment = await this._commentRepository.findOneById(commentId);

    if (!comment) {
      return new Left(
        new NotFoundException(
          `The comment identified by '${commentId}' was not found`,
        ),
      );
    }

    let feedback = await this._feedbackRepository.findByOwnerAndComment(
      requestUser,
      comment,
    );

    // toggles the like
    if (feedback && feedback.status) {
      await this._feedbackRepository.remove(feedback);
      return new Right(void 0);
    } else {
      feedback = new Feedback({
        status: true,
        owner: requestUser,
        comment,
      });
      feedback = await this._feedbackRepository.save(feedback);
      return new Right(void 0);
    }
  }
}

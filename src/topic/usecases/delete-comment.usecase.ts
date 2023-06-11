import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Role } from '../../user/domain/models/role.enum';
import { User } from '../../user/domain/models/user';
import { Comment } from '../domain/models/comment';

import { Left, Right } from '../../common/domain/classes/either';
import { CommentRepository } from '../infrastructure/repositories/comment.repository';

@Injectable()
export class DeleteCommentUseCase {
  constructor(private readonly _commentRepository: CommentRepository) {}

  async delete(requestUser: User, commentId: string) {
    const comment = await this._commentRepository.findOneById(commentId);

    if (!comment) {
      return new Left(
        new NotFoundException(`Comment with id '${commentId}' not found`),
      );
    }

    if (!this._canDelete(requestUser, comment)) {
      return new Left(
        new ForbiddenException(
          'You do not have permissions to delete comments',
        ),
      );
    }

    await this._commentRepository.remove(comment);
    return new Right(void 0);
  }

  private _canDelete(user: User, comment: Comment) {
    if (user.hasRole(Role.admin)) {
      return true;
    }

    if (user.owns(comment)) {
      return true;
    }

    return false;
  }
}

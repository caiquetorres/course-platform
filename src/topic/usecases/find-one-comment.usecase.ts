import { HttpException, Injectable, NotFoundException } from '@nestjs/common';

import { User } from '../../user/domain/models/user';
import { Comment } from '../domain/models/comment';

import { Either, Left, Right } from '../../common/domain/classes/either';
import { CommentRepository } from '../infrastructure/repositories/comment.repository';

@Injectable()
export class FindOneCommentUseCase {
  constructor(private readonly _commentRepository: CommentRepository) {}

  async find(
    _requestUser: User,
    commentId: string,
  ): Promise<Either<HttpException, Comment>> {
    const comment = await this._commentRepository.findOneById(commentId);

    if (!comment) {
      return new Left(
        new NotFoundException(`Topic with id '${commentId}' not found`),
      );
    }

    return new Right(comment);
  }
}

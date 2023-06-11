import {
  ForbiddenException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Role } from '../../user/domain/models/role.enum';
import { User } from '../../user/domain/models/user';
import { Comment } from '../domain/models/comment';
import { CreateCommentDto } from '../presentation/create-comment.dto';

import { Either, Left, Right } from '../../common/domain/classes/either';
import { CommentRepository } from '../infrastructure/repositories/comment.repository';
import { TopicRepository } from '../infrastructure/repositories/topic.repository';

@Injectable()
export class CreateCommentUsecase {
  constructor(
    private readonly _commentRepository: CommentRepository,
    private readonly _topicRepository: TopicRepository,
  ) {}

  async create(
    requestUser: User,
    topicId: string,
    dto: CreateCommentDto,
  ): Promise<Either<HttpException, Comment>> {
    if (requestUser.hasRole(Role.guest)) {
      return new Left(
        new ForbiddenException(
          'You do not have permissions to create comments',
        ),
      );
    }

    const topic = await this._topicRepository.findOneById(topicId);

    if (!topic) {
      return new Left(
        new NotFoundException(`Topic with id '${topicId}' not found`),
      );
    }

    let comment = new Comment({
      text: dto.text,
      owner: requestUser,
      topic,
    });
    comment = await this._commentRepository.save(comment);
    return new Right(comment);
  }
}

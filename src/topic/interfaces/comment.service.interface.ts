import { User } from '../../user/entities/user.entity';
import { Comment } from '../entities/comment.entity';

import { CreateCommentDto } from '../dtos/create-comment.dto';

import { PageQuery } from '../../common/classes/page.query';
import { IPage } from '../../common/interfaces/page.interface';

export interface ICommentService {
  createOne(
    requestUser: User,
    topicId: string,
    dto: CreateCommentDto,
  ): Promise<Comment>;

  findOne(
    requestUser: User,
    commentId: string,
    topicId: string,
  ): Promise<Comment>;

  findMany(
    requestUser: User,
    topicId: string,
    query: PageQuery,
  ): Promise<IPage<Comment>>;

  deleteOne(
    requestUser: User,
    commentId: string,
    topicId: string,
  ): Promise<Comment>;
}

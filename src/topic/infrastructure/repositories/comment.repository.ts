import { Comment } from '../../domain/models/comment';
import { Topic } from '../../domain/models/topic';

import { IPage } from '../../../common/domain/interfaces/page.interface';
import { PageQuery } from '../../../common/presentation/page.query';

export abstract class CommentRepository {
  abstract save(comment: Comment): Promise<Comment>;

  abstract findOneById(id: string): Promise<Comment | null>;

  abstract findManyByTopic(
    topic: Topic,
    pageQuery: PageQuery,
  ): Promise<IPage<Comment>>;

  abstract remove(comment: Comment): Promise<void>;
}

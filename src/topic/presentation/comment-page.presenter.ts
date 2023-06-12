import { Comment } from '../domain/models/comment';

import { IPage } from '../../common/domain/interfaces/page.interface';
import { PagePresenter } from '../../common/presentation/page.presenter';
import { CommentPresenter } from './comment.presenter';

export class CommentPagePresenter extends PagePresenter(CommentPresenter) {
  constructor(page: IPage<Comment>) {
    super({
      cursor: page.cursor,
      data: page.data.map((comment) => new CommentPresenter(comment)),
    });
  }
}

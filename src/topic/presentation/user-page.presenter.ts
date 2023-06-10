import { Topic } from '../domain/models/topic';

import { IPage } from '../../common/domain/interfaces/page.interface';
import { PagePresenter } from '../../common/presentation/page.presenter';
import { TopicPresenter } from './topic.presenter';

export class TopicPagePresenter extends PagePresenter(TopicPresenter) {
  constructor(page: IPage<Topic>) {
    super({
      cursor: page.cursor,
      data: page.data.map((topic) => new TopicPresenter(topic)),
    });
  }
}

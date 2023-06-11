import { Topic } from '../../domain/models/topic';

import { IPage } from '../../../common/domain/interfaces/page.interface';
import { PageQuery } from '../../../common/presentation/page.query';

export abstract class TopicRepository {
  abstract save(topic: Topic): Promise<Topic>;

  abstract findOneById(id: string): Promise<Topic | null>;

  abstract findMany(query: PageQuery): Promise<IPage<Topic>>;

  abstract remove(topic: Topic): Promise<void>;
}

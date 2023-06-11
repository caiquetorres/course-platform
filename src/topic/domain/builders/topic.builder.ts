import { User } from '../../../user/domain/models/user';
import { Topic } from '../models/topic';

import { ITopic } from '../interfaces/topic.interface';
import { v4 } from 'uuid';

export class TopicBuilder {
  private readonly _topic: Partial<ITopic> = {};

  withId(id: string) {
    this._topic.id = id;
    return this;
  }

  withRandomId() {
    this._topic.id = v4();
    return this;
  }

  withTitle(title: string) {
    this._topic.title = title;
    return this;
  }

  withOwner(owner: User) {
    this._topic.owner = owner;
    return this;
  }

  build() {
    return new Topic(this._topic as Topic);
  }
}

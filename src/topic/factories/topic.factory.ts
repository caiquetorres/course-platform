import { Topic } from '../entities/topic.entity';

import { IUser } from '../../user/interfaces/user.interface';

export class TopicFactory {
  private _title: string | null = null;

  private _owner: IUser | null = null;

  withTitle(title: string) {
    this._title = title;
    return this;
  }

  withOwner(owner: IUser) {
    this._owner = owner;
    return this;
  }

  build() {
    return new Topic({});
  }
}

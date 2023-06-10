import { User } from '../../../user/domain/models/user';

import { ITopic } from '../interfaces/topic.interface';

interface ITopicConstructor {
  id?: string;

  createdAt?: Date;

  updatedAt?: Date;

  deletedAt?: Date | null;

  title: string;

  owner: User;
}

export class Topic implements Readonly<ITopic> {
  readonly id: string;

  readonly createdAt: Date;

  readonly updatedAt: Date;

  readonly deletedAt: Date | null;

  readonly title: string;

  readonly owner: User;

  constructor(topic: ITopicConstructor) {
    Object.assign(this, topic);
    Object.freeze(this);
  }
}

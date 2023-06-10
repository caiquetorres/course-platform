import { User } from '../../../user/domain/models/user';

import { ILog } from '../interfaces/log.interface';

interface ILogConstructor {
  timestamp?: Date;

  resource: string;

  user: string | User;

  action: 'added' | 'spent' | 'rewarded';

  credits: number;
}

export class Log implements Readonly<ILog> {
  readonly timestamp = new Date();

  readonly resource: string;

  readonly userId: string;

  readonly action: 'added' | 'spent' | 'rewarded';

  readonly credits: number;

  constructor(log: ILogConstructor) {
    const { user, ...rest } = log;
    Object.assign(this, rest);
    this.userId = user instanceof User ? user.id : user;
    Object.freeze(this);
  }
}

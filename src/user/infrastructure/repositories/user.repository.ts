import { User } from '../../domain/models/user';

import { IPage } from '../../../common/domain/interfaces/page.interface';
import { PageQuery } from '../../../common/presentation/page.query';

export abstract class UserRepository {
  abstract findOneById(id: string): Promise<User | null>;

  abstract findOneByUsername(username: string): Promise<User | null>;

  abstract findOneByEmail(email: string): Promise<User | null>;

  abstract findOneByUsernameOrEmail(
    usernameOrEmail: string,
  ): Promise<User | null>;

  abstract createOne(user: User): Promise<User>;

  abstract findMany(query: PageQuery): Promise<IPage<User>>;
}

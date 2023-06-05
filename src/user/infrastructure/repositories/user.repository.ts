import { User } from '../../domain/models/user';

export abstract class UserRepository {
  abstract findOneById(id: string): Promise<User | null>;

  abstract findOneByUsername(username: string): Promise<User | null>;

  abstract findOneByEmail(email: string): Promise<User | null>;

  abstract findOneByUsernameOrEmail(
    usernameOrEmail: string,
  ): Promise<User | null>;

  abstract createOne(user: User): Promise<User>;
}

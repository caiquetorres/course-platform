import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from '../../entities/user.entity';

import { User } from '../../../domain/models/user';

import { Email } from '../../../domain/value-objects/email';
import { Password } from '../../../domain/value-objects/password';
import { Username } from '../../../domain/value-objects/username';
import { UserRepository } from '../user.repository';

export class UserTypeOrmRepository extends UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly _repository: Repository<UserEntity>,
  ) {
    super();
  }

  override async findOneById(id: string): Promise<User> {
    const user = await this._repository.findOneBy({ id });
    return user ? this._toModel(user) : null;
  }

  override async findOneByUsername(username: string): Promise<User> {
    const user = await this._repository.findOneBy({ username });
    return user ? this._toModel(user) : null;
  }

  override async findOneByEmail(email: string): Promise<User> {
    const user = await this._repository.findOneBy({ email });
    return user ? this._toModel(user) : null;
  }

  override async findOneByUsernameOrEmail(
    usernameOrEmail: string,
  ): Promise<User> {
    const user = await this._repository.findOne({
      where: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });
    return user ? this._toModel(user) : null;
  }

  override async createOne(user: User): Promise<User> {
    let entity = this._toEntity(user);
    entity = await this._repository.save(entity);
    return this._toModel(entity);
  }

  private _toEntity(user: User): UserEntity {
    const entity = new UserEntity();

    entity.id = user.id;
    entity.createdAt = user.createdAt;
    entity.updatedAt = user.updatedAt;
    entity.deletedAt = user.deletedAt;

    entity.name = user.name;
    entity.username = user.username.value;
    entity.email = user.email.value;
    entity.password = user.password.value;
    entity.roles = [...user.roles];

    return entity;
  }

  private _toModel(entity: UserEntity): User {
    return new User({
      id: entity.id,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
      name: entity.name,
      username: new Username(entity.username),
      email: new Email(entity.email),
      password: new Password(entity.password),
      roles: new Set(entity.roles),
    });
  }
}

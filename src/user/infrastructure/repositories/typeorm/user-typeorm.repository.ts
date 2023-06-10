import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsUtils, Repository } from 'typeorm';
import { buildPaginator } from 'typeorm-cursor-pagination';

import { UserEntity } from '../../entities/user.entity';

import { User } from '../../../domain/models/user';

import { IPage } from '../../../../common/domain/interfaces/page.interface';
import { PageQuery } from '../../../../common/presentation/page.query';
import { UserRepository } from '../user.repository';

@Injectable()
export class UserTypeOrmRepository extends UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly _repository: Repository<UserEntity>,
  ) {
    super();
  }

  override async findOneById(id: string): Promise<User> {
    const entity = await this._repository.findOneBy({ id });
    return entity ? entity.toModel() : null;
  }

  override async findOneByUsername(username: string): Promise<User> {
    const entity = await this._repository.findOneBy({ username });
    return entity ? entity.toModel() : null;
  }

  override async findOneByEmail(email: string): Promise<User> {
    const entity = await this._repository.findOneBy({ email });
    return entity ? entity.toModel() : null;
  }

  override async findOneByUsernameOrEmail(
    usernameOrEmail: string,
  ): Promise<User> {
    const entity = await this._repository.findOne({
      where: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });
    return entity ? entity.toModel() : null;
  }

  override async findMany(query: PageQuery): Promise<IPage<User>> {
    const paginator = buildPaginator({
      entity: UserEntity,
      alias: 'users',
      paginationKeys: ['id'],
      query,
    });

    const queryBuilder = this._repository.createQueryBuilder('users');

    FindOptionsUtils.joinEagerRelations(
      queryBuilder,
      queryBuilder.alias,
      this._repository.metadata,
    );

    const page = await paginator.paginate(queryBuilder);
    return {
      cursor: page.cursor,
      data: page.data.map((entity) => entity.toModel()),
    };
  }

  override async save(user: User): Promise<User> {
    let entity = UserEntity.fromModel(user);
    entity = await this._repository.save(entity);
    return entity.toModel();
  }

  override async removeOne(user: User): Promise<void> {
    const entity = UserEntity.fromModel(user);
    await this._repository.remove(entity);
  }
}

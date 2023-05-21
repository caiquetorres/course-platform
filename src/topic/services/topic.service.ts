import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsUtils, Repository } from 'typeorm';
import { buildPaginator } from 'typeorm-cursor-pagination';

import { User } from '../../user/entities/user.entity';
import { Topic } from '../entities/topic.entity';

import { Role } from '../../user/enums/role.enum';
import { CreateTopicDto } from '../dtos/create-topic.dto';

import { ITopicService } from '../interfaces/topic.service.interface';

import { PageQuery } from '../../common/classes/page.query';
import { IPage } from '../../common/interfaces/page.interface';
import { TopicFactory } from '../factories/topic.factory';

@Injectable()
export class TopicService implements ITopicService {
  constructor(
    @InjectRepository(Topic)
    private readonly _topicRepository: Repository<Topic>,
    @InjectRepository(User)
    private readonly _userRepository: Repository<User>,
  ) {}

  createOne(requestUser: User, dto: CreateTopicDto): Promise<Topic> {
    const create = async () => {
      let user = requestUser;
      const { ownerId } = dto;

      owner: if (ownerId) {
        user = await this._userRepository.findOneBy({ id: ownerId });

        if (!user) {
          throw new NotFoundException(`User with id '${ownerId}' not found`);
        }

        if (requestUser.hasRole(Role.admin)) {
          break owner;
        }

        if (requestUser.id === user.id) {
          break owner;
        }

        throw new ForbiddenException(
          'You do not have permission to access this resource',
        );
      }

      const topic = new TopicFactory()
        .withTitle(dto.title)
        .withOwner(user)
        .build();

      return this._topicRepository.save(topic);
    };

    if (!requestUser.hasRole(Role.guest)) {
      return create();
    }

    throw new ForbiddenException(
      'You do not have permission to access this resource',
    );
  }

  async findOne(_requestUser: User, id: string): Promise<Topic> {
    const user = await this._topicRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`Topic with id '${id}' not found`);
    }

    return user;
  }

  findMany(_requestUser: User, query: PageQuery): Promise<IPage<Topic>> {
    const paginator = buildPaginator({
      entity: Topic,
      alias: 'topics',
      paginationKeys: ['id'],
      query,
    });

    const queryBuilder = this._topicRepository.createQueryBuilder('topics');

    FindOptionsUtils.joinEagerRelations(
      queryBuilder,
      queryBuilder.alias,
      this._topicRepository.metadata,
    );

    return paginator.paginate(queryBuilder);
  }

  async deleteOne(requestUser: User, id: string): Promise<Topic> {
    const topic = await this._topicRepository.findOne({
      where: { id },
      relations: ['owner'],
    });

    if (!topic) {
      throw new NotFoundException(`Topic with id '${id}' not found`);
    }

    validations: {
      if (requestUser.hasRole(Role.admin)) {
        break validations;
      }

      if (topic.owner.id === requestUser.id) {
        break validations;
      }

      throw new ForbiddenException(
        'You do not have permissions to access these sources',
      );
    }

    return this._topicRepository.remove(topic);
  }
}

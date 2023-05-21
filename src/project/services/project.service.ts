import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsUtils, Repository } from 'typeorm';
import { buildPaginator } from 'typeorm-cursor-pagination';

import { User } from '../../user/entities/user.entity';
import { Project } from '../entities/project.entity';

import { Role } from '../../user/enums/role.enum';
import { CreateProjectDto } from '../dtos/create-project.dto';
import { UpdateProjectDto } from '../dtos/update-project.dto';

import { IProjectService } from '../interfaces/project.service.interface';

import { PageQuery } from '../../common/classes/page.query';
import { IPage } from '../../common/interfaces/page.interface';
import { ProjectFactory } from '../factories/project.factory';

@Injectable()
export class ProjectService implements IProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly _projectRepository: Repository<Project>,
    @InjectRepository(User)
    private readonly _userRepository: Repository<User>,
  ) {}

  /**
   * @inheritdoc
   */
  createOne(requestUser: User, dto: CreateProjectDto): Promise<Project> {
    const create = async () => {
      let owner: User;

      if (dto.ownerId) {
        owner = await this._userRepository.findOneBy({ id: dto.ownerId });

        if (!owner) {
          throw new NotFoundException(`User with id '${owner.id}' not found`);
        }

        if (requestUser.id !== owner.id) {
          throw new ForbiddenException(
            'You do not have permission to access this resource',
          );
        }
      } else {
        owner = requestUser;
      }

      const project = new ProjectFactory()
        .withName(dto.name)
        .withOwner(owner)
        .build();

      return this._projectRepository.save(project);
    };

    if (requestUser.hasRole(Role.pro)) {
      return create();
    }

    if (requestUser.hasRole(Role.admin)) {
      return create();
    }

    throw new ForbiddenException(
      'You do not have permission to access this resource',
    );
  }

  async findOne(_requestUser: User, id: string): Promise<Project> {
    const project = await this._projectRepository.findOne({
      where: { id },
      relations: ['owner'],
    });

    if (!project) {
      throw new NotFoundException(`Project with id '${id}' not found`);
    }

    return project;
  }

  findMany(_requestUser: User, query: PageQuery): Promise<IPage<Project>> {
    const paginator = buildPaginator({
      entity: Project,
      alias: 'projects',
      paginationKeys: ['id'],
      query,
    });

    const queryBuilder = this._projectRepository.createQueryBuilder('projects');

    FindOptionsUtils.joinEagerRelations(
      queryBuilder,
      queryBuilder.alias,
      this._userRepository.metadata,
    );

    return paginator.paginate(queryBuilder);
  }

  updateOne(
    requestUser: User,
    id: string,
    dto: UpdateProjectDto,
  ): Promise<Project> {
    const update = async () => {
      let project = await this._projectRepository.findOne({
        where: { id },
        relations: ['owner'],
      });

      if (!project) {
        throw new NotFoundException(`Project with id '${id}' not found`);
      }

      if (project.owner.id !== requestUser.id) {
        throw new ForbiddenException(
          'You do not have permissions to access these sources',
        );
      }

      project = new ProjectFactory().from(project).withName(dto.name).build();

      return this._projectRepository.save(project);
    };

    if (requestUser.hasRole(Role.admin)) {
      return update();
    }

    throw new ForbiddenException(
      'You do not have permissions to access these sources',
    );
  }

  deleteOne(requestUser: User, id: string): Promise<Project> {
    const remove = async () => {
      const project = await this._projectRepository.findOne({
        where: { id },
        relations: ['owner'],
      });

      if (!project) {
        throw new NotFoundException(`Project with id '${id}' not found`);
      }

      if (project.owner.id !== requestUser.id) {
        throw new ForbiddenException(
          'You do not have permissions to access these sources',
        );
      }

      return this._projectRepository.remove(project);
    };

    if (requestUser.hasRole(Role.admin)) {
      return remove();
    }

    throw new ForbiddenException(
      'You do not have permissions to access these sources',
    );
  }
}

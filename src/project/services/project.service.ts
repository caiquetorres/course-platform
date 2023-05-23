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
  async createOne(requestUser: User, dto: CreateProjectDto): Promise<Project> {
    validations: {
      if (requestUser.hasRole(Role.admin)) {
        break validations;
      }

      // The own user is creating the project.
      if (!dto.ownerId && requestUser.hasRole(Role.pro)) {
        break validations;
      }

      // The user is registering himself as owner.
      if (requestUser.id === dto.ownerId && requestUser.hasRole(Role.pro)) {
        break validations;
      }

      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }

    let owner: User;

    if (dto.ownerId) {
      owner = await this._userRepository.findOneBy({ id: dto.ownerId });

      if (!owner) {
        throw new NotFoundException(`User with id '${owner.id}' not found`);
      }
    } else {
      owner = requestUser;
    }

    const project = new ProjectFactory()
      .withName(dto.name)
      .withOwner(owner)
      .build();

    delete project.id;
    return this._projectRepository.save(project);
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

  async updateOne(
    requestUser: User,
    id: string,
    dto: UpdateProjectDto,
  ): Promise<Project> {
    let project = await this._projectRepository.findOne({
      where: { id },
      relations: ['owner'],
    });

    if (!project) {
      throw new NotFoundException(`Project with id '${id}' not found`);
    }

    validations: {
      if (requestUser.hasRole(Role.admin)) {
        break validations;
      }

      if (project.owner.id === requestUser.id) {
        break validations;
      }

      throw new ForbiddenException(
        'You do not have permissions to access these sources',
      );
    }

    project = new ProjectFactory().from(project).withName(dto.name).build();
    return this._projectRepository.save(project);
  }

  async deleteOne(requestUser: User, id: string): Promise<Project> {
    const project = await this._projectRepository.findOne({
      where: { id },
      relations: ['owner'],
    });

    if (!project) {
      throw new NotFoundException(`Project with id '${id}' not found`);
    }

    validations: {
      if (requestUser.hasRole(Role.admin)) {
        break validations;
      }

      if (
        requestUser.hasRole(Role.pro) &&
        project.owner.id === requestUser.id
      ) {
        break validations;
      }

      throw new ForbiddenException(
        'You do not have permissions to access these sources',
      );
    }

    return this._projectRepository.remove(project);
  }
}

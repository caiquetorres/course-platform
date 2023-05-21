import {
  ConflictException,
  ForbiddenException,
  ImATeapotException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../../user/entities/user.entity';
import { Application } from '../entities/application.entity';
import { Project } from '../entities/project.entity';

import { Role } from '../../user/enums/role.enum';

import { IApplicationService } from '../interfaces/application.service.interface';

import { ApplicationFactory } from '../factories/application.factory';

export class ApplicationService implements IApplicationService {
  constructor(
    @InjectRepository(Application)
    private readonly _applicationRepository: Repository<Application>,
    @InjectRepository(Project)
    private readonly _projectRepository: Repository<Project>,
  ) {}

  async apply(requestUser: User, projectId: string) {
    const apply = async () => {
      const project = await this._projectRepository.findOne({
        where: { id: projectId },
        relations: ['user'],
      });

      if (!project) {
        throw new NotFoundException(`Project with id '${projectId}' not found`);
      }

      if (project.owner.id === requestUser.id) {
        throw new ImATeapotException('You cannot apply to your own project');
      }

      let application = await this._applicationRepository.findOne({
        where: {
          user: { id: requestUser.id },
          project: { id: projectId },
        },
        relations: ['user', 'project'],
      });

      if (application) {
        throw new ConflictException(
          'There already is an application for this project',
        );
      }

      application = new ApplicationFactory()
        .withUser(requestUser)
        .withProject(project)
        .build();

      await this._applicationRepository.save(application);
    };

    if (requestUser.hasRole(Role.admin)) {
      return apply();
    }

    if (requestUser.hasRole(Role.pro)) {
      return apply();
    }

    throw new ForbiddenException(
      'You do not have permissions to access these sources',
    );
  }

  async withdraw(requestUser: User, projectId: string) {
    const withdraw = async () => {
      const project = await this._projectRepository.findOne({
        where: { id: projectId },
        relations: ['user'],
      });

      if (!project) {
        throw new NotFoundException(`Project with id '${projectId}' not found`);
      }

      if (project.owner.id === requestUser.id) {
        throw new ImATeapotException(
          'You cannot withdraw from your own project',
        );
      }

      const application = await this._applicationRepository.findOne({
        where: {
          user: { id: requestUser.id },
          project: { id: projectId },
        },
        relations: ['user', 'project'],
      });

      if (!application) {
        throw new NotFoundException(
          `Application to the project defined by '${projectId}' not found`,
        );
      }

      await this._applicationRepository.remove(application);
    };

    if (requestUser.hasRole(Role.admin)) {
      return withdraw();
    }

    if (requestUser.hasRole(Role.pro)) {
      return withdraw();
    }

    throw new ForbiddenException(
      'You do not have permissions to access these sources',
    );
  }
}

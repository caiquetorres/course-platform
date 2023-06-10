import { HttpException, Injectable, NotFoundException } from '@nestjs/common';

import { Role } from '../../user/domain/models/role.enum';
import { User } from '../../user/domain/models/user';

import { Either, Left, Right } from '../../common/domain/classes/either';
import { ApplicationRepository } from '../infrastructure/repositories/application.repository';
import { ProjectRepository } from '../infrastructure/repositories/project.repository';
import { Application } from 'express';

@Injectable()
export class QuitFromProjectUseCase {
  constructor(
    private readonly _applicationRepository: ApplicationRepository,
    private readonly _projectRepository: ProjectRepository,
  ) {}

  async quit(
    requestUser: User,
    projectId: string,
  ): Promise<Either<HttpException, Application>> {
    const project = await this._projectRepository.findOneById(projectId);

    if (!project) {
      return new Left(
        new NotFoundException(
          `The project identified by '${project}' was not found`,
        ),
      );
    }

    const application = await this._applicationRepository.findByOwnerAndProject(
      requestUser,
      project,
    );

    if (!application) {
      return new Left(
        new NotFoundException('You do not have applications on this project'),
      );
    }

    await this._applicationRepository.remove(application);
    return new Right(void 0);
  }

  private _canApply(user: User) {
    if (user.hasRole(Role.admin)) {
      return true;
    }

    if (user.hasRole(Role.pro)) {
      return true;
    }

    // authors cannot apply, only if they already have the pro role.
    return false;
  }
}

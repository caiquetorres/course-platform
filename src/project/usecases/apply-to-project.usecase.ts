import {
  ConflictException,
  ForbiddenException,
  HttpException,
  ImATeapotException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Role } from '../../user/domain/models/role.enum';
import { User } from '../../user/domain/models/user';
import { Application } from '../domain/models/application';

import { Either, Left, Right } from '../../common/domain/classes/either';
import { ApplicationRepository } from '../infrastructure/repositories/application.repository';
import { ProjectRepository } from '../infrastructure/repositories/project.repository';

@Injectable()
export class ApplyToProjectUseCase {
  constructor(
    private readonly _applicationRepository: ApplicationRepository,
    private readonly _projectRepository: ProjectRepository,
  ) {}

  async apply(
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

    if (!this._canApply(requestUser)) {
      return new Left(
        new ForbiddenException(
          'You do not have permissions to apply to this project',
        ),
      );
    }

    if (requestUser.owns(project)) {
      return new Left(
        new ImATeapotException('You cannot apply to your own project'),
      );
    }

    let application = await this._applicationRepository.findByOwnerAndProject(
      requestUser,
      project,
    );

    if (application) {
      return new Left(
        new ConflictException('You have already applied to this project'),
      );
    }

    application = new Application({
      owner: requestUser,
      project,
    });
    application = await this._applicationRepository.save(application);
    return new Right(application);
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

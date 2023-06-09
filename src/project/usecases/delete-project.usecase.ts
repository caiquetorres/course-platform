import {
  ForbiddenException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Role } from '../../user/domain/models/role.enum';
import { User } from '../../user/domain/models/user';
import { Project } from '../domain/models/project';

import { Either, Left, Right } from '../../common/domain/classes/either';
import { ProjectRepository } from '../infrastructure/repositories/project.repository';

@Injectable()
export class DeleteProjectUseCase {
  constructor(private readonly _projectRepository: ProjectRepository) {}

  async delete(
    requestUser: User,
    projectId: string,
  ): Promise<Either<HttpException, Project>> {
    const project = await this._projectRepository.findOneById(projectId);

    if (!project) {
      return new Left(
        new NotFoundException(
          `The project identified by '${projectId}' was not fond`,
        ),
      );
    }

    if (!this._canDelete(requestUser, project)) {
      return new Left(
        new ForbiddenException(
          'You do not have permissions to delete this project',
        ),
      );
    }

    await this._projectRepository.remove(project);
    return new Right(void 0);
  }

  private _canDelete(user: User, project: Project) {
    if (user.hasRole(Role.admin)) {
      return true;
    }

    if (user.owns(project)) {
      return true;
    }

    return false;
  }
}

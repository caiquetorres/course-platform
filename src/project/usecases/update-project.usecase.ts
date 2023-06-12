import {
  ForbiddenException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Role } from '../../user/domain/models/role.enum';
import { User } from '../../user/domain/models/user';
import { Project } from '../domain/models/project';
import { UpdateProjectDto } from '../presentation/update-project.dto';

import { Either, Left, Right } from '../../common/domain/classes/either';
import { ProjectRepository } from '../infrastructure/repositories/project.repository';

@Injectable()
export class UpdateProjectUseCase {
  constructor(private readonly _projectRepository: ProjectRepository) {}

  async update(
    requestUser: User,
    projectId: string,
    dto: UpdateProjectDto,
  ): Promise<Either<HttpException, Project>> {
    let project = await this._projectRepository.findOneById(projectId);

    if (!project) {
      return new Left(
        new NotFoundException(
          `The project identified by '${projectId}' was not fond`,
        ),
      );
    }

    if (!this._canUpdate(requestUser, project)) {
      return new Left(
        new ForbiddenException(
          'You do not have permissions to update this project',
        ),
      );
    }

    project = new Project({
      ...project,
      name: dto.name,
      description: dto.description,
    });
    project = await this._projectRepository.save(project);
    return new Right(project);
  }

  private _canUpdate(user: User, project: Project) {
    if (user.hasRole(Role.admin)) {
      return true;
    }

    if (user.owns(project)) {
      return true;
    }

    return false;
  }
}

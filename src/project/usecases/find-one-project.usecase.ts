import { HttpException, Injectable, NotFoundException } from '@nestjs/common';

import { User } from '../../user/domain/models/user';
import { Project } from '../domain/models/project';

import { Either, Left, Right } from '../../common/domain/classes/either';
import { ProjectRepository } from '../infrastructure/repositories/project.repository';

@Injectable()
export class FindOneProjectUseCase {
  constructor(private readonly _projectRepository: ProjectRepository) {}

  async find(
    _requestUser: User,
    projectId: string,
  ): Promise<Either<HttpException, Project>> {
    const project = await this._projectRepository.findOneById(projectId);

    if (!project) {
      return new Left(
        new NotFoundException(
          `The project identified by '${projectId}' was not found`,
        ),
      );
    }

    return new Right(project);
  }
}

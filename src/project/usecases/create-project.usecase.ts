import { ForbiddenException, HttpException, Injectable } from '@nestjs/common';

import { Role } from '../../user/domain/models/role.enum';
import { User } from '../../user/domain/models/user';
import { Project } from '../domain/models/project';
import { CreateProjectDto } from '../presentation/create-project.dto';

import { Either, Left, Right } from '../../common/domain/classes/either';
import { ProjectRepository } from '../infrastructure/repositories/project.repository';

@Injectable()
export class CreateProjectUseCase {
  constructor(private readonly _projectRepository: ProjectRepository) {}

  async create(
    requestUser: User,
    dto: CreateProjectDto,
  ): Promise<Either<HttpException, Project>> {
    if (!this._canCreate(requestUser)) {
      return new Left(
        new ForbiddenException(
          'You do not have permissions to create projects',
        ),
      );
    }

    let project = new Project({
      name: dto.name,
      description: dto.description,
      owner: requestUser,
    });

    project = await this._projectRepository.save(project);
    return new Right(project);
  }

  private _canCreate(user: User) {
    if (user.hasRole(Role.admin)) {
      return true;
    }

    if (user.hasRole(Role.pro)) {
      return true;
    }

    return false;
  }
}

import { HttpException, Injectable } from '@nestjs/common';

import { User } from '../../user/domain/models/user';
import { Project } from '../domain/models/project';

import { Either, Right } from '../../common/domain/classes/either';
import { IPage } from '../../common/domain/interfaces/page.interface';
import { PageQuery } from '../../common/presentation/page.query';
import { ProjectRepository } from '../infrastructure/repositories/project.repository';

@Injectable()
export class FindManyProjectsUseCase {
  constructor(private readonly _projectRepository: ProjectRepository) {}

  async find(
    _requestUser: User,
    pageQuery: PageQuery,
  ): Promise<Either<HttpException, IPage<Project>>> {
    const projects = await this._projectRepository.findMany(pageQuery);
    return new Right(projects);
  }
}

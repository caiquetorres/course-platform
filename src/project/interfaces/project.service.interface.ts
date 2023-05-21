import { User } from '../../user/entities/user.entity';
import { Project } from '../entities/project.entity';

import { CreateProjectDto } from '../dtos/create-project.dto';
import { UpdateProjectDto } from '../dtos/update-project.dto';

import { PageQuery } from '../../common/classes/page.query';
import { IPage } from '../../common/interfaces/page.interface';

export interface IProjectService {
  createOne(requestUser: User, dto: CreateProjectDto): Promise<Project>;

  findOne(requestUser: User, id: string): Promise<Project>;

  findMany(requestUser: User, query: PageQuery): Promise<IPage<Project>>;

  updateOne(
    requestUser: User,
    id: string,
    dto: UpdateProjectDto,
  ): Promise<Project>;

  deleteOne(requestUser: User, id: string): Promise<Project>;
}

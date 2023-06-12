import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsUtils, Repository } from 'typeorm';
import { buildPaginator } from 'typeorm-cursor-pagination';

import { ProjectEntity } from '../../entities/project.entity';

import { Project } from '../../../domain/models/project';

import { IPage } from '../../../../common/domain/interfaces/page.interface';
import { PageQuery } from '../../../../common/presentation/page.query';
import { ProjectRepository } from '../project.repository';

export class ProjectTypeOrmRepository extends ProjectRepository {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly _repository: Repository<ProjectEntity>,
  ) {
    super();
  }

  override async save(project: Project): Promise<Project> {
    let entity = ProjectEntity.fromModel(project);
    entity = await this._repository.save(entity);
    return entity.toModel();
  }

  override async findOneById(id: string): Promise<Project> {
    const entity = await this._repository.findOneBy({ id });
    return entity ? entity.toModel() : null;
  }

  override async findMany(query: PageQuery): Promise<IPage<Project>> {
    const paginator = buildPaginator({
      entity: ProjectEntity,
      alias: 'projects',
      paginationKeys: ['id'],
      query,
    });

    const queryBuilder = this._repository.createQueryBuilder('projects');

    FindOptionsUtils.joinEagerRelations(
      queryBuilder,
      queryBuilder.alias,
      this._repository.metadata,
    );

    const page = await paginator.paginate(queryBuilder);
    return {
      cursor: page.cursor,
      data: page.data.map((entity) => entity.toModel()),
    };
  }

  override async remove(project: Project): Promise<void> {
    const entity = ProjectEntity.fromModel(project);
    await this._repository.remove(entity);
  }
}

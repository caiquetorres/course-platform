import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProjectEntity } from '../../entities/project.entity';

import { Project } from '../../../domain/models/project';

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
}

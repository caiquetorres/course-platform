import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ApplicationEntity } from '../../entities/application.entity';

import { User } from '../../../../user/domain/models/user';
import { Application } from '../../../domain/models/application';
import { Project } from '../../../domain/models/project';

import { ApplicationRepository } from '../application.repository';

@Injectable()
export class ApplicationTypeOrmRepository extends ApplicationRepository {
  constructor(
    @InjectRepository(ApplicationEntity)
    private readonly _repository: Repository<ApplicationEntity>,
  ) {
    super();
  }

  override async save(application: Application): Promise<Application> {
    let entity = ApplicationEntity.fromModel(application);
    entity = await this._repository.save(entity);
    return entity.toModel();
  }

  override async findByOwnerAndProject(
    owner: User,
    project: Project,
  ): Promise<Application> {
    const entity = await this._repository.findOneBy({
      owner: { id: owner.id },
      project: { id: project.id },
    });
    return entity ? entity.toModel() : null;
  }

  override async remove(application: Application): Promise<void> {
    const entity = ApplicationEntity.fromModel(application);
    await this._repository.remove(entity);
  }
}

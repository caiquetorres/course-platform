import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectEntity } from './infrastructure/entities/project.entity';

import { ProjectRepository } from './infrastructure/repositories/project.repository';
import { ProjectTypeOrmRepository } from './infrastructure/repositories/typeorm/project-typeorm.repository';
import { CreateProjectUseCase } from './usecases/create-project.usecase';
import { FindManyProjectsUseCase } from './usecases/find-many-projects.usecase';
import { FindOneProjectUseCase } from './usecases/find-one-project.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectEntity])],
  providers: [
    CreateProjectUseCase,
    FindOneProjectUseCase,
    FindManyProjectsUseCase,
    {
      provide: ProjectRepository,
      useClass: ProjectTypeOrmRepository,
    },
  ],
})
export class ProjectModule {}

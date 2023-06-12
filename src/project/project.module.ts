import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ApplicationEntity } from './infrastructure/entities/application.entity';
import { ProjectEntity } from './infrastructure/entities/project.entity';

import { ProjectApplicationController } from './presentation/project-application.controller';
import { ProjectController } from './presentation/project.controller';

import { ApplicationRepository } from './infrastructure/repositories/application.repository';
import { ProjectRepository } from './infrastructure/repositories/project.repository';
import { ApplicationTypeOrmRepository } from './infrastructure/repositories/typeorm/application-typeorm.repository';
import { ProjectTypeOrmRepository } from './infrastructure/repositories/typeorm/project-typeorm.repository';
import { ApplyToProjectUseCase } from './usecases/apply-to-project.usecase';
import { CreateProjectUseCase } from './usecases/create-project.usecase';
import { DeleteProjectUseCase } from './usecases/delete-project.usecase';
import { FindManyProjectsUseCase } from './usecases/find-many-projects.usecase';
import { FindOneProjectUseCase } from './usecases/find-one-project.usecase';
import { QuitFromProjectUseCase } from './usecases/quit-from-project.usecase';
import { UpdateProjectUseCase } from './usecases/update-project.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectEntity, ApplicationEntity])],
  controllers: [ProjectController, ProjectApplicationController],
  providers: [
    CreateProjectUseCase,
    FindOneProjectUseCase,
    FindManyProjectsUseCase,
    UpdateProjectUseCase,
    DeleteProjectUseCase,
    ApplyToProjectUseCase,
    QuitFromProjectUseCase,
    {
      provide: ProjectRepository,
      useClass: ProjectTypeOrmRepository,
    },
    {
      provide: ApplicationRepository,
      useClass: ApplicationTypeOrmRepository,
    },
  ],
})
export class ProjectModule {}

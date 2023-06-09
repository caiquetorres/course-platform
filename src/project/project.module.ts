import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectEntity } from './infrastructure/entities/project.entity';

import { ProjectRepository } from './infrastructure/repositories/project.repository';
import { ProjectTypeOrmRepository } from './infrastructure/repositories/typeorm/project-typeorm.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectEntity])],
  providers: [
    {
      provide: ProjectRepository,
      useClass: ProjectTypeOrmRepository,
    },
  ],
})
export class ProjectModule {}

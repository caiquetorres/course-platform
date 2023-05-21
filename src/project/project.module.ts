import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '../user/entities/user.entity';
import { Project } from './entities/project.entity';

import { ProjectService } from './services/project.service';

import { ProjectController } from './controllers/project.controller';

import { PROJECT_SERVICE } from './constants/project.constant';

@Module({
  imports: [TypeOrmModule.forFeature([Project, User])],
  controllers: [ProjectController],
  providers: [
    {
      provide: PROJECT_SERVICE,
      useClass: ProjectService,
    },
  ],
})
export class ProjectModule {}

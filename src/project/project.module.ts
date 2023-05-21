import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '../user/entities/user.entity';
import { Application } from './entities/application.entity';
import { Project } from './entities/project.entity';

import { ApplicationService } from './services/application.service';
import { ProjectService } from './services/project.service';

import { ApplicationController } from './controllers/application.controller';
import { ProjectController } from './controllers/project.controller';

import {
  APPLICATION_SERVICE,
  PROJECT_SERVICE,
} from './constants/project.constant';

@Module({
  imports: [TypeOrmModule.forFeature([Project, User, Application])],
  controllers: [ProjectController, ApplicationController],
  providers: [
    {
      provide: PROJECT_SERVICE,
      useClass: ProjectService,
    },
    {
      provide: APPLICATION_SERVICE,
      useClass: ApplicationService,
    },
  ],
})
export class ProjectModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Course } from '../course/entities/course.entity';
import { User } from './entities/user.entity';

import {
  USER_COURSES_SERVICE,
  USER_SERVICE,
} from './constants/service.constant';
import { UserCoursesService } from './services/user-courses.service';
import { UserService } from './services/user.service';

import { UserCoursesController } from './controllers/user-courses.controller';
import { UserController } from './controllers/user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Course])],
  controllers: [UserController, UserCoursesController],
  providers: [
    {
      provide: USER_SERVICE,
      useClass: UserService,
    },
    {
      provide: USER_COURSES_SERVICE,
      useClass: UserCoursesService,
    },
  ],
})
export class UserModule {}

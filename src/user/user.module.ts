import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from './infrastructure/entities/user.entity';

import { UserCourseController } from './presentation/user-course.controller';
import { UserController } from './presentation/user.controller';

import { CourseModule } from '../course/course.module';
import { LogModule } from '../log/log.module';
import { UserTypeOrmRepository } from './infrastructure/repositories/typeorm/user-typeorm.repository';
import { UserRepository } from './infrastructure/repositories/user.repository';
import { CreateUserUseCase } from './usecases/create-user.usecase';
import { DeleteUserUseCase } from './usecases/delete-user.usecase';
import { FindCoursesByAuthorIdUseCase } from './usecases/find-courses-by-author-id.usecase';
import { FindManyUsersUseCase as FindAllUsersUseCase } from './usecases/find-many-users.usecase';
import { FindMeUseCase } from './usecases/find-me.usecase';
import { FindOneUserUseCase as FindOneUserUseCase } from './usecases/find-one-user.usecase';
import { FindOwnedCoursesUseCase } from './usecases/find-owned-courses.usecase';
import { UpdateUserUseCase } from './usecases/update-user.usecase';

@Module({
  imports: [CourseModule, LogModule, TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController, UserCourseController],
  providers: [
    CreateUserUseCase,
    FindMeUseCase,
    FindOneUserUseCase,
    FindAllUsersUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    FindOwnedCoursesUseCase,
    FindCoursesByAuthorIdUseCase,
    {
      provide: UserRepository,
      useClass: UserTypeOrmRepository,
    },
  ],
  exports: [UserRepository],
})
export class UserModule {}

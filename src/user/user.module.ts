import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from './infrastructure/entities/user.entity';

import { UserController } from './presentation/user.controller';

import { UserTypeOrmRepository } from './infrastructure/repositories/typeorm/user-typeorm.repository';
import { UserRepository } from './infrastructure/repositories/user.repository';
import { CreateUserUseCase } from './usecases/create-user.usecase';
import { DeleteUserUseCase } from './usecases/delete-user.usecase';
import { FindManyUsersUseCase as FindAllUsersUseCase } from './usecases/find-many-users.usecase';
import { FindMeUseCase } from './usecases/find-me.usecase';
import { FindOneUserUseCase as FindOneUserUseCase } from './usecases/find-one-user.usecase';
import { UpdateUserUseCase } from './usecases/update-user.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [
    CreateUserUseCase,
    FindMeUseCase,
    FindOneUserUseCase,
    FindAllUsersUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    {
      provide: UserRepository,
      useClass: UserTypeOrmRepository,
    },
  ],
  exports: [UserRepository],
})
export class UserModule {}

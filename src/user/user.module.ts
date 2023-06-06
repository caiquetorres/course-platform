import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from './infrastructure/entities/user.entity';

import { UserController } from './presentation/user.controller';

import { UserTypeOrmRepository } from './infrastructure/repositories/typeorm/user-typeorm.repository';
import { UserRepository } from './infrastructure/repositories/user.repository';
import { CreateUserUseCase } from './usecases/create-user.usecase';
import { FindMeUseCase } from './usecases/get-me.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [
    CreateUserUseCase,
    FindMeUseCase,
    {
      provide: UserRepository,
      useClass: UserTypeOrmRepository,
    },
  ],
  exports: [UserRepository],
})
export class UserModule {}

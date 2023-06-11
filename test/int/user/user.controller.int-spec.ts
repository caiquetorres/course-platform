import { ConflictException, ForbiddenException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Role } from '../../../src/user/domain/models/role.enum';
import { User } from '../../../src/user/domain/models/user';
import { CreateUserDto } from '../../../src/user/presentation/create-user.dto';
import { UpdateUserDto } from '../../../src/user/presentation/update-user.dto';

import { UserController } from '../../../src/user/presentation/user.controller';

import { LogRepository } from '../../../src/log/infrastructure/repositories/log.repository';
import { Email } from '../../../src/user/domain/value-objects/email';
import { Password } from '../../../src/user/domain/value-objects/password';
import { Username } from '../../../src/user/domain/value-objects/username';
import { UserRepository } from '../../../src/user/infrastructure/repositories/user.repository';
import { UserModule } from '../../../src/user/user.module';
import { UserBuilder } from '../../builders/user/user.builder';
import path from 'path';

describe('UserController (int)', () => {
  let controller: UserController;
  let repository: UserRepository;

  beforeEach(async () => {
    const entitiesPath = path.resolve(__dirname, '../../../src/**/*.entity.ts');

    const moduleRef = await Test.createTestingModule({
      imports: [
        UserModule,
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          dropSchema: true,
          synchronize: true,
          entities: [entitiesPath],
        }),
      ],
    })
      .overrideProvider(LogRepository)
      .useValue(null)
      .compile();

    controller = moduleRef.get(UserController);
    repository = moduleRef.get(UserRepository);
  });

  describe('Create user', () => {
    it('should create a new user', async () => {
      const requestUser = new UserBuilder().asGuest().build();

      const dto = new CreateUserDto();
      dto.name = 'Jane Doe';
      dto.email = 'janedoe@email.com';
      dto.username = 'janedoe';
      dto.password = 'JaneDoe123*';

      const user = await controller.createOne(requestUser, dto);

      expect(user).toBeDefined();
      expect(user).toHaveProperty('name', 'Jane Doe');
      expect(user).not.toHaveProperty('password');
      expect(user).toHaveProperty('permissions');
    });

    it('should throw a Conflict Exception when the user with the given email was already registered', async () => {
      const requestUser = new UserBuilder().asGuest().build();

      await repository.save(
        new User({
          name: 'John Doe',
          password: Password.from('JohnDoe123*'),
          username: new Username('johndoe'),
          email: new Email('duplicated@email.com'),
          roles: new Set<Role>([Role.user]),
        }),
      );

      const dto = new CreateUserDto();
      dto.name = 'Jane Doe';
      dto.email = 'duplicated@email.com';
      dto.username = 'janedoe';
      dto.password = 'JaneDoe123*';

      expect(
        async () => await controller.createOne(requestUser, dto),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('Get user', () => {
    it('should get the logger user', async () => {
      const requestUser = await repository.save(
        new User({
          name: 'Jane Doe',
          password: Password.from('JaneDoe123*'),
          username: new Username('janedoe'),
          email: new Email('janedoe@email.com'),
          roles: new Set<Role>([Role.user]),
        }),
      );

      const result = await controller.findMe(requestUser);
      expect(result).toHaveProperty('name', requestUser.name);
      expect(result).not.toHaveProperty('password');
    });

    it('should get the user by id', async () => {
      const requestUser = await repository.save(
        new User({
          name: 'Jane Doe',
          password: Password.from('JaneDoe123*'),
          username: new Username('janedoe'),
          email: new Email('janedoe@email.com'),
          roles: new Set<Role>([Role.user]),
        }),
      );

      const result = await controller.findOne(requestUser, requestUser.id);
      expect(result).toHaveProperty('name', requestUser.name);
      expect(result).not.toHaveProperty('password');
    });

    it('should throw a Forbidden Exception when the user that is trying to the the information is not permitted', async () => {
      const requestUser = new UserBuilder().withRandomId().asUser().build();

      const targetUser = await repository.save(
        new User({
          name: 'Jane Doe',
          password: Password.from('JaneDoe123*'),
          username: new Username('janedoe'),
          email: new Email('janedoe@email.com'),
          roles: new Set<Role>([Role.user]),
        }),
      );

      expect(
        async () => await controller.findOne(requestUser, targetUser.id),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('Update user', () => {
    it('should update the user', async () => {
      const requestUser = await repository.save(
        new User({
          name: 'Jane Doe',
          password: Password.from('JaneDoe123*'),
          username: new Username('janedoe'),
          email: new Email('janedoe@email.com'),
          roles: new Set<Role>([Role.user]),
        }),
      );

      const dto = new UpdateUserDto();
      dto.name = 'Mary Doe';

      const result = await controller.updateOne(
        requestUser,
        requestUser.id,
        dto,
      );
      expect(result).toHaveProperty('name', dto.name);
      expect(result).not.toHaveProperty('password');
    });
  });

  describe('Delete user', () => {
    it('should delete the user', async () => {
      const requestUser = await repository.save(
        new User({
          name: 'Jane Doe',
          password: Password.from('JaneDoe123*'),
          username: new Username('janedoe'),
          email: new Email('janedoe@email.com'),
          roles: new Set<Role>([Role.user]),
        }),
      );

      const result = await controller.deleteOne(requestUser, requestUser.id);
      expect(result).toBeUndefined();
    });
  });
});

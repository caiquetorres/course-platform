import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Course } from '../../course/entities/course.entity';
import { User } from '../entities/user.entity';

import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';

import { USER_SERVICE } from '../constants/user.constant';
import { UserService } from './user.service';

import { UserFactory } from '../factories/user.factory';
import { UserModule } from '../user.module';
import { Email } from '../value-objects/email';
import { Password } from '../value-objects/password';

describe('UserService (int)', () => {
  let userService: UserService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        UserModule,
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          dropSchema: true,
          synchronize: true,
          entities: [User, Course],
        }),
      ],
    }).compile();

    userService = moduleRef.get(USER_SERVICE);
    userRepository = moduleRef.get(getRepositoryToken(User));
  });

  describe('Create one user', () => {
    it('should create one user', async () => {
      const requestUser = new UserFactory().asGuest().build();

      const dto = new CreateUserDto();
      dto.name = 'Jane Doe';
      dto.username = 'janedoe';
      dto.email = 'jane.doe@email.com';
      dto.password = 'JaneDoe123*';

      const createdUser = await userService.createOne(requestUser, dto);

      expect(createdUser).toBeDefined();
      expect(createdUser.id).toBeTruthy();
    });

    it('should throw a Conflict Exception due to conflicted username or email', async () => {
      const requestUser = new UserFactory().asGuest().build();

      const dto = new CreateUserDto();
      dto.name = 'Jane Doe';
      dto.username = 'janedoe';
      dto.email = 'jane.doe@email.com';
      dto.password = 'JaneDoe123*';

      const defaultUser = new UserFactory()
        .withName('Jane Doe')
        .withUsername('janedoe')
        .withEmail(new Email('jane.doe@email.com'))
        .withPassword(new Password('JaneDoe123*'))
        .asUser()
        .build();

      delete defaultUser.id;
      await userRepository.save(defaultUser);

      expect(() => userService.createOne(requestUser, dto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('Find one user', () => {
    it('should return a user given his id', async () => {
      let defaultUser = new UserFactory()
        .withName('Jane Doe')
        .withUsername('janedoe')
        .withEmail(new Email('jane.doe@email.com'))
        .withPassword(new Password('JaneDoe123*'))
        .asUser()
        .build();

      delete defaultUser.id;
      defaultUser = await userRepository.save(defaultUser);

      const requestUser = new UserFactory()
        .withId(defaultUser.id)
        .asUser()
        .build();

      const user = await userService.findOne(requestUser, defaultUser.id);
      expect(user).toBeDefined();
    });

    it('should throw a Not Found Exception if the user does not exist', async () => {
      const requestUser = new UserFactory().asAdmin().build();

      expect(() => userService.findOne(requestUser, '123')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('Updates one user', () => {
    it('should update one user', async () => {
      let defaultUser = new UserFactory()
        .withName('Jane Doe')
        .withUsername('janedoe')
        .withEmail(new Email('jane.doe@email.com'))
        .withPassword(new Password('JaneDoe123*'))
        .asUser()
        .build();

      delete defaultUser.id;
      defaultUser = await userRepository.save(defaultUser);

      const dto = new UpdateUserDto();
      dto.name = 'John Doe';

      const requestUser = new UserFactory()
        .withId(defaultUser.id)
        .asUser()
        .build();

      const createdUser = await userService.updateOne(
        requestUser,
        defaultUser.id,
        dto,
      );
      expect(createdUser).toBeDefined();
    });

    it('should throw a Not Found Exception if the user does not exist', async () => {
      const dto = new UpdateUserDto();
      dto.name = 'John Doe';

      const requestUser = new UserFactory().asAdmin().build();

      expect(() =>
        userService.updateOne(requestUser, '123', dto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('Deletes one user', () => {
    it('should delete one user', async () => {
      let defaultUser = new UserFactory()
        .withName('Jane Doe')
        .withUsername('janedoe')
        .withEmail(new Email('jane.doe@email.com'))
        .withPassword(new Password('JaneDoe123*'))
        .asUser()
        .build();

      delete defaultUser.id;
      defaultUser = await userRepository.save(defaultUser);

      const requestUser = new UserFactory()
        .withId(defaultUser.id)
        .asUser()
        .build();

      const deletedUser = await userService.deleteOne(
        requestUser,
        defaultUser.id,
      );

      expect(deletedUser).toBeDefined();
      expect(deletedUser).toHaveProperty('id', undefined);
    });

    it('should throw a Not Found Exception if the user does not exist', async () => {
      const requestUser = new UserFactory().asAdmin().build();

      expect(() => userService.deleteOne(requestUser, '123')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});

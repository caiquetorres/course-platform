import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../entities/user.entity';

import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';

import { UserService } from './user.service';

import { UserFactory } from '../factories/user.factory';
import { TestBed } from '@automock/jest';
import { v4 } from 'uuid';

describe('UserService (unit)', () => {
  let userService: UserService;
  let userRepository: Repository<User>;

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(UserService).compile();

    userService = unit;
    userRepository = unitRef.get(getRepositoryToken(User) as string);
  });

  describe('Create one user', () => {
    it('should create one user', async () => {
      jest.spyOn(userRepository, 'save').mockResolvedValueOnce({} as any);

      jest
        .spyOn(userRepository, 'findOne')
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null);

      const requestUser = new UserFactory().asGuest().build();

      const dto = new CreateUserDto();
      dto.name = 'Jane Doe';
      dto.username = 'janedoe';
      dto.email = 'jane.doe@email.com';
      dto.password = 'JaneDoe123*';

      const createdUser = await userService.createOne(requestUser, dto);
      expect(createdUser).toBeDefined();
    });

    it('should throw a Unprocessable Entity Exception due to an invalid email', () => {
      jest
        .spyOn(userRepository, 'findOne')
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null);

      const requestUser = new UserFactory().asGuest().build();

      const dto = new CreateUserDto();
      dto.name = 'Jane Doe';
      dto.username = 'janedoe';
      dto.email = 'invalid email';
      dto.password = 'JaneDoe123*';

      expect(() => userService.createOne(requestUser, dto)).rejects.toThrow(
        UnprocessableEntityException,
      );
    });

    it('should throw a Unprocessable Entity Exception due to an invalid password', () => {
      jest
        .spyOn(userRepository, 'findOne')
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null);

      const requestUser = new UserFactory().asGuest().build();

      const dto = new CreateUserDto();
      dto.name = 'Jane Doe';
      dto.username = 'janedoe';
      dto.email = 'jane.doe@email.com';
      dto.password = 'invalid password';

      expect(() => userService.createOne(requestUser, dto)).rejects.toThrow(
        UnprocessableEntityException,
      );
    });

    it('should throw a Conflict Exception due to conflicted username or email', async () => {
      jest
        .spyOn(userRepository, 'findOne')
        .mockResolvedValueOnce({} as any)
        .mockResolvedValueOnce({} as any);

      const requestUser = new UserFactory().asGuest().build();

      const dto = new CreateUserDto();
      dto.name = 'Jane Doe';
      dto.username = 'janedoe';
      dto.email = 'jane.doe@email.com';
      dto.password = 'JaneDoe123*';

      expect(() => userService.createOne(requestUser, dto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('Find one user', () => {
    it('should return a user given his id', async () => {
      const id = v4();
      const requestUser = new UserFactory().withId(id).asUser().build();

      jest
        .spyOn(userRepository, 'findOneBy')
        .mockResolvedValueOnce({ id } as any);

      const user = await userService.findOne(requestUser, id);
      expect(user).toBeDefined();
    });

    it('should return a user given his id (admin)', async () => {
      const id = v4();
      const requestUser = new UserFactory().asAdmin().build();

      jest
        .spyOn(userRepository, 'findOneBy')
        .mockResolvedValueOnce({ id } as any);

      const user = await userService.findOne(requestUser, id);
      expect(user).toBeDefined();
    });

    it('should throw a Not Found Exception if the user does not exist', () => {
      const id = v4();
      const requestUser = new UserFactory().asAdmin().build();

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValueOnce(null);

      expect(() => userService.findOne(requestUser, id)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw a Forbidden Exception if the request user is not and admin and not the user himself', () => {
      const id = v4();
      const requestUser = new UserFactory().withId(v4()).asUser().build();

      expect(() => userService.findOne(requestUser, id)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('Updates one user', () => {
    it('should update one user', async () => {
      const id = v4();

      jest.spyOn(userRepository, 'save').mockResolvedValueOnce({} as any);
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce({} as any);

      const requestUser = new UserFactory().withId(id).asGuest().build();

      const dto = new UpdateUserDto();
      dto.name = 'Jane Doe';

      const createdUser = await userService.updateOne(requestUser, id, dto);
      expect(createdUser).toBeDefined();
    });

    it('should update one user (admin)', async () => {
      const id = v4();

      jest.spyOn(userRepository, 'save').mockResolvedValueOnce({} as any);
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce({} as any);

      const requestUser = new UserFactory().asAdmin().build();

      const dto = new UpdateUserDto();
      dto.name = 'Jane Doe';

      const createdUser = await userService.updateOne(requestUser, id, dto);
      expect(createdUser).toBeDefined();
    });

    it('should throw a Not Found Exception if the user does not exist', async () => {
      const id = v4();

      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);

      const requestUser = new UserFactory().asAdmin().build();

      const dto = new UpdateUserDto();
      dto.name = 'Jane Doe';

      expect(() => userService.updateOne(requestUser, id, dto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw a Forbidden Exception if the request user is not and admin and not the user himself', () => {
      const id = v4();
      const requestUser = new UserFactory().withId(v4()).asUser().build();

      const dto = new UpdateUserDto();
      dto.name = 'Jane Doe';

      expect(() => userService.updateOne(requestUser, id, dto)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('Deletes one user', () => {
    it('should delete one user', async () => {
      const id = v4();

      jest.spyOn(userRepository, 'remove').mockResolvedValueOnce({} as any);
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValueOnce({} as any);

      const requestUser = new UserFactory().withId(id).asGuest().build();

      const createdUser = await userService.deleteOne(requestUser, id);
      expect(createdUser).toBeDefined();
    });

    it('should delete one user', async () => {
      const id = v4();

      jest.spyOn(userRepository, 'remove').mockResolvedValueOnce({} as any);
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValueOnce({} as any);

      const requestUser = new UserFactory().asAdmin().build();

      const createdUser = await userService.deleteOne(requestUser, id);
      expect(createdUser).toBeDefined();
    });

    it('Exception if the user does not exist', async () => {
      const id = v4();

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValueOnce(null);

      const requestUser = new UserFactory().asAdmin().build();

      expect(() => userService.deleteOne(requestUser, id)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw a Forbidden Exception if the request user is not and admin and not the user himself', () => {
      const id = v4();
      const requestUser = new UserFactory().withId(v4()).asUser().build();

      expect(() => userService.deleteOne(requestUser, id)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});

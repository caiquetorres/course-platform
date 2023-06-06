import { ForbiddenException, NotFoundException, Type } from '@nestjs/common';

import { Role } from '../domain/models/role.enum';
import { User } from '../domain/models/user';

import { IUser } from '../domain/interfaces/user.interface';
import { UserRepository } from '../infrastructure/repositories/user.repository';
import { FindOneUserUseCase } from './find-one-user.usecase';
import { TestBed } from '@automock/jest';
import { v4 } from 'uuid';

describe('FindOneUserUseCase (unit)', () => {
  let useCase: FindOneUserUseCase;
  let userRepository: UserRepository;

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(FindOneUserUseCase).compile();

    useCase = unit;
    userRepository = unitRef.get(UserRepository as Type);
  });

  it('should get the request user', async () => {
    const requestUser = new User({
      id: v4(),
      roles: new Set([Role.user]),
    } as IUser);

    jest
      .spyOn(userRepository, 'findOneById')
      .mockResolvedValueOnce(requestUser);

    const result = await useCase.findOne(requestUser, requestUser.id);

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toBeDefined();
  });

  it('should get the request user if the user is an admin', async () => {
    jest.spyOn(userRepository, 'findOneById').mockResolvedValueOnce({} as User);

    const requestUser = new User({
      id: v4(),
      roles: new Set([Role.admin]),
    } as IUser);

    const result = await useCase.findOne(requestUser, v4());

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toBeDefined();
  });

  it('should throw a not found error when the id represents a user that does not exist', async () => {
    jest.spyOn(userRepository, 'findOneById').mockResolvedValueOnce(null);

    const requestUser = new User({
      roles: new Set([Role.admin]),
    } as IUser);

    const result = await useCase.findOne(requestUser, v4());

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotFoundException);
  });

  it('should throw a forbidden error when the user has no permissions to access those sources', async () => {
    jest.spyOn(userRepository, 'findOneById').mockResolvedValueOnce({} as User);

    const requestUser = new User({
      id: v4(),
      roles: new Set([Role.user]),
    } as IUser);

    const result = await useCase.findOne(requestUser, v4());

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ForbiddenException);
  });
});

import { Type } from '@nestjs/common';

import { Role } from '../domain/models/role.enum';
import { User } from '../domain/models/user';

import { ForbiddenError } from '../../common/domain/errors/forbidden.error';
import { UserNotFoundError } from '../domain/errors/user-not-found.error';
import { IUser } from '../domain/interfaces/user.interface';
import { UserRepository } from '../infrastructure/repositories/user.repository';
import { FindOneUseCase } from './find-one.usecase';
import { TestBed } from '@automock/jest';
import { v4 } from 'uuid';

describe('FindOneUseCase (unit)', () => {
  let createUserUseCase: FindOneUseCase;
  let userRepository: UserRepository;

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(FindOneUseCase).compile();

    createUserUseCase = unit;
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

    const result = await createUserUseCase.findOne(requestUser, requestUser.id);

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toBeDefined();
  });

  it('should get the request user if the user is an admin', async () => {
    jest.spyOn(userRepository, 'findOneById').mockResolvedValueOnce({} as User);

    const requestUser = new User({
      id: v4(),
      roles: new Set([Role.admin]),
    } as IUser);

    const result = await createUserUseCase.findOne(requestUser, v4());

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toBeDefined();
  });

  it('should throw a not found error when the id represents a user that does not exist', async () => {
    jest.spyOn(userRepository, 'findOneById').mockResolvedValueOnce(null);

    const requestUser = new User({
      roles: new Set([Role.admin]),
    } as IUser);

    const result = await createUserUseCase.findOne(requestUser, v4());

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(UserNotFoundError);
  });

  it('should throw a forbidden error when the user has no permissions to access those sources', async () => {
    jest.spyOn(userRepository, 'findOneById').mockResolvedValueOnce({} as User);

    const requestUser = new User({
      id: v4(),
      roles: new Set([Role.user]),
    } as IUser);

    const result = await createUserUseCase.findOne(requestUser, v4());

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ForbiddenError);
  });
});

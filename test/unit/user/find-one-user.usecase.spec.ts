import { ForbiddenException, NotFoundException, Type } from '@nestjs/common';

import { User } from '../../../src/user/domain/models/user';

import { UserRepository } from '../../../src/user/infrastructure/repositories/user.repository';
import { FindOneUserUseCase } from '../../../src/user/usecases/find-one-user.usecase';
import { UserBuilder } from '../../builders/user/user.builder';
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
    const requestUser = new UserBuilder().withRandomId().asUser().build();

    jest
      .spyOn(userRepository, 'findOneById')
      .mockResolvedValueOnce(requestUser);

    const result = await useCase.findOne(requestUser, requestUser.id);

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toBeDefined();
  });

  it('should get the request user if the user is an admin', async () => {
    jest.spyOn(userRepository, 'findOneById').mockResolvedValueOnce({} as User);

    const requestUser = new UserBuilder().withRandomId().asAdmin().build();

    const result = await useCase.findOne(requestUser, v4());

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toBeDefined();
  });

  it('should throw a not found error when the id represents a user that does not exist', async () => {
    jest.spyOn(userRepository, 'findOneById').mockResolvedValueOnce(null);

    const requestUser = new UserBuilder().withRandomId().asAdmin().build();

    const result = await useCase.findOne(requestUser, v4());

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotFoundException);
  });

  it('should throw a forbidden error when the user has no permissions to access those sources', async () => {
    jest.spyOn(userRepository, 'findOneById').mockResolvedValueOnce({} as User);

    const requestUser = new UserBuilder().withRandomId().asUser().build();

    const result = await useCase.findOne(requestUser, v4());

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ForbiddenException);
  });
});

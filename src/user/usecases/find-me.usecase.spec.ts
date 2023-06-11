import { ForbiddenException, Type } from '@nestjs/common';

import { User } from '../domain/models/user';

import { UserBuilder } from '../domain/builders/user.builder';
import { UserRepository } from '../infrastructure/repositories/user.repository';
import { FindMeUseCase } from './find-me.usecase';
import { TestBed } from '@automock/jest';

describe('FindMeUseCase (unit)', () => {
  let useCase: FindMeUseCase;
  let userRepository: UserRepository;

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(FindMeUseCase).compile();

    useCase = unit;
    userRepository = unitRef.get(UserRepository as Type);
  });

  it('should get the request user', async () => {
    jest.spyOn(userRepository, 'findOneById').mockResolvedValueOnce({} as User);

    const requestUser = new UserBuilder().withRandomId().asUser().build();

    const result = await useCase.findMe(requestUser);

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toBeDefined();
  });

  it('should return Left when the request user is a guest', async () => {
    jest.spyOn(userRepository, 'findOneById').mockResolvedValueOnce({} as User);

    const requestUser = new UserBuilder().withRandomId().asGuest().build();

    const result = await useCase.findMe(requestUser);

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ForbiddenException);
  });
});

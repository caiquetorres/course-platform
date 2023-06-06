import { ForbiddenException, Type } from '@nestjs/common';

import { User } from '../domain/models/user';

import { IPage } from '../../common/domain/interfaces/page.interface';
import { UserBuilder } from '../domain/builders/user.builder';
import { UserRepository } from '../infrastructure/repositories/user.repository';
import { FindManyUsersUseCase } from './find-many-users.usecase';
import { TestBed } from '@automock/jest';

describe('FindManyUsersUseCase (unit)', () => {
  let useCase: FindManyUsersUseCase;
  let userRepository: UserRepository;

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(FindManyUsersUseCase).compile();

    useCase = unit;
    userRepository = unitRef.get(UserRepository as Type);
  });

  it('should get the request user', async () => {
    jest
      .spyOn(userRepository, 'findMany')
      .mockResolvedValueOnce({ data: [{}, {}, {}] } as IPage<User>);

    const requestUser = new UserBuilder().withRandomId().asAdmin().build();

    const result = await useCase.findMany(requestUser, {
      afterCursor: null,
      beforeCursor: null,
      limit: 10,
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toBeDefined();
  });

  it('should return Left when the request user is not an admin', async () => {
    jest
      .spyOn(userRepository, 'findMany')
      .mockResolvedValueOnce({ data: [{}, {}, {}] } as IPage<User>);

    const requestUser = new UserBuilder().withRandomId().asUser().build();

    const result = await useCase.findMany(requestUser, {
      afterCursor: null,
      beforeCursor: null,
      limit: 10,
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ForbiddenException);
  });
});

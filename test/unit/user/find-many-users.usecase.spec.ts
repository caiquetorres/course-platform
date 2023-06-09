import { ForbiddenException, Type } from '@nestjs/common';

import { User } from '../../../src/user/domain/models/user';

import { IPage } from '../../../src/common/domain/interfaces/page.interface';
import { UserRepository } from '../../../src/user/infrastructure/repositories/user.repository';
import { FindManyUsersUseCase } from '../../../src/user/usecases/find-many-users.usecase';
import { UserBuilder } from '../../builders/user/user.builder';
import { TestBed } from '@automock/jest';

describe('FindManyUsersUseCase (unit)', () => {
  let useCase: FindManyUsersUseCase;
  let repository: UserRepository;

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(FindManyUsersUseCase).compile();

    useCase = unit;
    repository = unitRef.get(UserRepository as Type);
  });

  it('should get the request user', async () => {
    jest
      .spyOn(repository, 'findMany')
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
      .spyOn(repository, 'findMany')
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

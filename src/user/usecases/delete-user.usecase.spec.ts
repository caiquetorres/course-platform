import { ForbiddenException, NotFoundException, Type } from '@nestjs/common';

import { UserBuilder } from '../domain/builders/user.builder';
import { UserRepository } from '../infrastructure/repositories/user.repository';
import { DeleteUserUseCase } from './delete-user.usecase';
import { TestBed } from '@automock/jest';
import { v4 } from 'uuid';

describe('DeleteUserUseCase (unit)', () => {
  let useCase: DeleteUserUseCase;
  let userRepository: UserRepository;

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(DeleteUserUseCase).compile();

    useCase = unit;
    userRepository = unitRef.get(UserRepository as Type);
  });

  it('should delete one user', async () => {
    const targetUser = new UserBuilder().withRandomId().build();

    const requestUser = new UserBuilder()
      .withId(targetUser.id)
      .asUser()
      .build();

    jest.spyOn(userRepository, 'save').mockResolvedValueOnce(targetUser);
    jest.spyOn(userRepository, 'findOneById').mockResolvedValueOnce(targetUser);

    const result = await useCase.delete(requestUser, targetUser.id);
    expect(result.isRight()).toBeTruthy();
  });

  it('should delete a user when the request is an admin', async () => {
    const targetUser = new UserBuilder().withRandomId().build();
    const requestUser = new UserBuilder().withRandomId().asAdmin().build();

    jest.spyOn(userRepository, 'save').mockResolvedValueOnce(targetUser);
    jest.spyOn(userRepository, 'findOneById').mockResolvedValueOnce(targetUser);

    const result = await useCase.delete(requestUser, targetUser.id);
    expect(result.isRight()).toBeTruthy();
  });

  it('should throw a Not Found Exception when the user does not exist', async () => {
    const targetUser = new UserBuilder().withRandomId().build();
    const requestUser = new UserBuilder().withRandomId().asUser().build();

    jest.spyOn(userRepository, 'save').mockResolvedValueOnce(targetUser);
    jest.spyOn(userRepository, 'findOneById').mockResolvedValueOnce(null);

    const result = await useCase.delete(requestUser, v4());
    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotFoundException);
  });

  it('should throw a Forbidden Exception when the user has no permissions', async () => {
    const targetUser = new UserBuilder().withRandomId().build();
    const requestUser = new UserBuilder().withRandomId().asUser().build();

    jest.spyOn(userRepository, 'save').mockResolvedValueOnce(targetUser);
    jest.spyOn(userRepository, 'findOneById').mockResolvedValueOnce(targetUser);

    const result = await useCase.delete(requestUser, targetUser.id);
    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ForbiddenException);
  });
});

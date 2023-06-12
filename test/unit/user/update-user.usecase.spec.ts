import { ForbiddenException, NotFoundException, Type } from '@nestjs/common';

import { UpdateUserDto } from '../../../src/user/presentation/update-user.dto';

import { UserRepository } from '../../../src/user/infrastructure/repositories/user.repository';
import { UpdateUserUseCase } from '../../../src/user/usecases/update-user.usecase';
import { UserBuilder } from '../../builders/user/user.builder';
import { TestBed } from '@automock/jest';
import { v4 } from 'uuid';

describe('UpdateUserUseCase (unit)', () => {
  let useCase: UpdateUserUseCase;
  let userRepository: UserRepository;

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(UpdateUserUseCase).compile();

    useCase = unit;
    userRepository = unitRef.get(UserRepository as Type);
  });

  it('should update one user', async () => {
    const targetUser = new UserBuilder().withRandomId().build();

    const requestUser = new UserBuilder()
      .withId(targetUser.id)
      .asUser()
      .build();

    jest.spyOn(userRepository, 'save').mockResolvedValueOnce(targetUser);
    jest.spyOn(userRepository, 'findOneById').mockResolvedValueOnce(targetUser);

    const dto = new UpdateUserDto();
    dto.name = 'Jane Doe';

    const result = await useCase.update(requestUser, targetUser.id, dto);
    expect(result.isRight()).toBeTruthy();
  });

  it('should update a user when the request is an admin', async () => {
    const targetUser = new UserBuilder().withRandomId().build();
    const requestUser = new UserBuilder().withRandomId().asAdmin().build();

    jest.spyOn(userRepository, 'save').mockResolvedValueOnce(targetUser);
    jest.spyOn(userRepository, 'findOneById').mockResolvedValueOnce(targetUser);

    const dto = new UpdateUserDto();
    dto.name = 'Jane Doe';

    const result = await useCase.update(requestUser, targetUser.id, dto);
    expect(result.isRight()).toBeTruthy();
  });

  it('should throw a Not Found Exception when the user does not exist', async () => {
    const targetUser = new UserBuilder().withRandomId().build();
    const requestUser = new UserBuilder().withRandomId().asUser().build();

    jest.spyOn(userRepository, 'save').mockResolvedValueOnce(targetUser);
    jest.spyOn(userRepository, 'findOneById').mockResolvedValueOnce(null);

    const dto = new UpdateUserDto();
    dto.name = 'Jane Doe';

    const result = await useCase.update(requestUser, v4(), dto);
    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotFoundException);
  });

  it('should throw a Forbidden Exception when the user has no permissions', async () => {
    const targetUser = new UserBuilder().withRandomId().build();
    const requestUser = new UserBuilder().withRandomId().asUser().build();

    jest.spyOn(userRepository, 'save').mockResolvedValueOnce(targetUser);
    jest.spyOn(userRepository, 'findOneById').mockResolvedValueOnce(targetUser);

    const dto = new UpdateUserDto();
    dto.name = 'Jane Doe';

    const result = await useCase.update(requestUser, targetUser.id, dto);
    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ForbiddenException);
  });
});

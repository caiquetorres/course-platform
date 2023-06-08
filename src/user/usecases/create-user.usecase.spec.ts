import { ConflictException, Type } from '@nestjs/common';

import { User } from '../domain/models/user';
import { CreateUserDto } from '../presentation/create-user.dto';

import { UserBuilder } from '../domain/builders/user.builder';
import { Email } from '../domain/value-objects/email';
import { Username } from '../domain/value-objects/username';
import { UserRepository } from '../infrastructure/repositories/user.repository';
import { CreateUserUseCase } from './create-user.usecase';
import { TestBed } from '@automock/jest';

describe('CreateUserUseCase (unit)', () => {
  let useCase: CreateUserUseCase;
  let userRepository: UserRepository;

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(CreateUserUseCase).compile();

    useCase = unit;
    userRepository = unitRef.get(UserRepository as Type);
  });

  it('should create one user', async () => {
    const requestUser = new UserBuilder().withRandomId().asGuest().build();

    const targetUser = new UserBuilder()
      .withRandomId()
      .withName('Jane Doe')
      .withUsername(new Username('janedoe'))
      .withEmail(new Email('jane.doe@email.com'))
      .asUser()
      .build();

    jest.spyOn(userRepository, 'save').mockResolvedValueOnce(targetUser);
    jest.spyOn(userRepository, 'findOneByUsername').mockResolvedValueOnce(null);
    jest.spyOn(userRepository, 'findOneByEmail').mockResolvedValueOnce(null);

    const dto = new CreateUserDto();
    dto.name = 'Jane Doe';
    dto.username = 'janedoe';
    dto.email = 'jane.doe@email.com';
    dto.password = 'JaneDoe123*';

    const result = await useCase.create(requestUser, dto);
    expect(result.isRight()).toBeTruthy();
    expect(result.value).toHaveProperty('name', targetUser.name);
  });

  it('should throw a Conflict Exception due to conflicted username', async () => {
    jest
      .spyOn(userRepository, 'findOneByUsername')
      .mockResolvedValueOnce({} as User);

    jest.spyOn(userRepository, 'findOneByEmail').mockResolvedValueOnce(null);

    const requestUser = new UserBuilder().withRandomId().asGuest().build();

    const dto = new CreateUserDto();
    dto.name = 'Jane Doe';
    dto.username = 'janedoe';
    dto.email = 'jane.doe@email.com';
    dto.password = 'JaneDoe123*';

    const result = await useCase.create(requestUser, dto);
    expect(result.isRight()).toBeFalsy();
    expect(result.value).toBeInstanceOf(ConflictException);
  });

  it('should throw a Conflict Exception due to conflicted email', async () => {
    jest.spyOn(userRepository, 'findOneByUsername').mockResolvedValueOnce(null);

    jest
      .spyOn(userRepository, 'findOneByEmail')
      .mockResolvedValueOnce({} as User);

    const requestUser = new UserBuilder().withRandomId().asGuest().build();

    const dto = new CreateUserDto();
    dto.name = 'Jane Doe';
    dto.username = 'janedoe';
    dto.email = 'jane.doe@email.com';
    dto.password = 'JaneDoe123*';

    const result = await useCase.create(requestUser, dto);
    expect(result.isRight()).toBeFalsy();
    expect(result.value).toBeInstanceOf(ConflictException);
  });
});

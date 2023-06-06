import { ConflictException, Type } from '@nestjs/common';

import { Role } from '../domain/models/role.enum';
import { User } from '../domain/models/user';
import { CreateUserDto } from '../presentation/create-user.dto';

import { IUser } from '../domain/interfaces/user.interface';
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
    jest.spyOn(userRepository, 'createOne').mockResolvedValueOnce({} as any);

    jest.spyOn(userRepository, 'findOneByUsername').mockResolvedValueOnce(null);

    jest.spyOn(userRepository, 'findOneByEmail').mockResolvedValueOnce(null);

    const requestUser = new User({
      roles: new Set([Role.guest]),
    } as IUser);

    const dto = new CreateUserDto();
    dto.name = 'Jane Doe';
    dto.username = 'janedoe';
    dto.email = 'jane.doe@email.com';
    dto.password = 'JaneDoe123*';

    const result = await useCase.create(requestUser, dto);
    expect(result.isRight()).toBeTruthy();
  });

  it('should throw a Conflict Exception due to conflicted username', async () => {
    jest
      .spyOn(userRepository, 'findOneByUsername')
      .mockResolvedValueOnce({} as User);

    jest.spyOn(userRepository, 'findOneByEmail').mockResolvedValueOnce(null);

    const requestUser = new User({
      roles: new Set([Role.guest]),
    } as IUser);

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

    const requestUser = new User({
      roles: new Set([Role.guest]),
    } as IUser);

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

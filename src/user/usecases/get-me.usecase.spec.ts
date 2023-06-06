import { Type } from '@nestjs/common';

import { Role } from '../domain/models/role.enum';
import { User } from '../domain/models/user';

import { ForbiddenError } from '../../common/domain/errors/forbidden.error';
import { IUser } from '../domain/interfaces/user.interface';
import { UserRepository } from '../infrastructure/repositories/user.repository';
import { FindMeUseCase } from './get-me.usecase';
import { TestBed } from '@automock/jest';

describe('GetMeUseCase (unit)', () => {
  let createUserUseCase: FindMeUseCase;
  let userRepository: UserRepository;

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(FindMeUseCase).compile();

    createUserUseCase = unit;
    userRepository = unitRef.get(UserRepository as Type);
  });

  describe('Get me', () => {
    it('should get the request user', async () => {
      jest
        .spyOn(userRepository, 'findOneById')
        .mockResolvedValueOnce({} as User);

      const requestUser = new User({
        roles: new Set([Role.user]),
      } as IUser);

      const result = await createUserUseCase.findMe(requestUser);

      expect(result.isRight()).toBeTruthy();
      expect(result.value).toBeDefined();
    });

    it('should return Left when the request user is a guest', async () => {
      jest
        .spyOn(userRepository, 'findOneById')
        .mockResolvedValueOnce({} as User);

      const requestUser = new User({
        roles: new Set([Role.guest]),
      } as IUser);

      const result = await createUserUseCase.findMe(requestUser);

      expect(result.isLeft()).toBeTruthy();
      expect(result.value).toBeInstanceOf(ForbiddenError);
    });
  });
});

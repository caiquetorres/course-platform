import { Type } from '@nestjs/common';

import { Topic } from '../domain/models/topic';

import { UserBuilder } from '../../user/domain/builders/user.builder';
import { TopicRepository } from '../infrastructure/repositories/topic.repository';
import { FindManyTopicsUseCase } from './find-many-topics.usecase';
import { TestBed } from '@automock/jest';

describe('FindManyTopicsUseCase (unit)', () => {
  let useCase: FindManyTopicsUseCase;
  let repository: TopicRepository;

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(FindManyTopicsUseCase).compile();

    useCase = unit;
    repository = unitRef.get(TopicRepository as Type);
  });

  it('should create a topic', async () => {
    const requestUser = new UserBuilder().withRandomId().asGuest().build();

    jest.spyOn(repository, 'findMany').mockResolvedValueOnce({
      cursor: null,
      data: [{}, {}, {}] as Topic[],
    });

    const result = await useCase.find(requestUser, {
      afterCursor: null,
      beforeCursor: null,
      limit: 10,
    });
    expect(result.isRight()).toBeTruthy();
    expect(result).toBeDefined();
  });
});

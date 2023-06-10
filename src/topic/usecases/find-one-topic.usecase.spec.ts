import { NotFoundException, Type } from '@nestjs/common';

import { UserBuilder } from '../../user/domain/builders/user.builder';
import { TopicBuilder } from '../domain/builders/topic.builder';
import { TopicRepository } from '../infrastructure/repositories/topic.repository';
import { FindOneTopicUseCase } from './find-one-topic.usecase';
import { TestBed } from '@automock/jest';
import { v4 } from 'uuid';

describe('FindOneTopicUseCase (unit)', () => {
  let useCase: FindOneTopicUseCase;
  let repository: TopicRepository;

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(FindOneTopicUseCase).compile();

    useCase = unit;
    repository = unitRef.get(TopicRepository as Type);
  });

  it('should create a topic', async () => {
    const requestUser = new UserBuilder().withRandomId().asGuest().build();
    const targetTopic = new TopicBuilder()
      .withRandomId()
      .withOwner(requestUser)
      .build();

    jest.spyOn(repository, 'findOneById').mockResolvedValueOnce(targetTopic);

    const result = await useCase.find(requestUser, targetTopic.id);
    expect(result.isRight()).toBeTruthy();
    expect(result).toBeDefined();
  });

  it('should throw a Not Found Exception when the topic does not exist', async () => {
    const requestUser = new UserBuilder().withRandomId().asGuest().build();

    jest.spyOn(repository, 'findOneById').mockResolvedValueOnce(null);

    const result = await useCase.find(requestUser, v4());

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotFoundException);
  });
});

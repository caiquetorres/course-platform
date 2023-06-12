import { ForbiddenException, NotFoundException, Type } from '@nestjs/common';

import { TopicRepository } from '../../../src/topic/infrastructure/repositories/topic.repository';
import { DeleteTopicUseCase } from '../../../src/topic/usecases/delete-topic.usecase';
import { UserBuilder } from '../../../test/builders/user/user.builder';
import { TopicBuilder } from '../../builders/topic/topic.builder';
import { TestBed } from '@automock/jest';
import { v4 } from 'uuid';

describe('DeleteTopicUseCase (unit)', () => {
  let useCase: DeleteTopicUseCase;
  let repository: TopicRepository;

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(DeleteTopicUseCase).compile();

    useCase = unit;
    repository = unitRef.get(TopicRepository as Type);
  });

  it('should delete a topic', async () => {
    const requestUser = new UserBuilder().withRandomId().asUser().build();
    const targetTopic = new TopicBuilder()
      .withRandomId()
      .withOwner(requestUser)
      .build();

    jest.spyOn(repository, 'findOneById').mockResolvedValueOnce(targetTopic);
    jest.spyOn(repository, 'remove').mockResolvedValueOnce(void 0);

    const result = await useCase.delete(requestUser, targetTopic.id);
    expect(result.isRight()).toBeTruthy();
  });

  it('should throw a Not Found Exception when the topic does not exist', async () => {
    const requestUser = new UserBuilder().withRandomId().asUser().build();

    jest.spyOn(repository, 'findOneById').mockResolvedValueOnce(null);

    const result = await useCase.delete(requestUser, v4());
    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotFoundException);
  });

  it('should throw a Forbidden Exception when the user has no permissions to update the topic', async () => {
    const requestUser = new UserBuilder().withRandomId().asUser().build();
    const targetTopic = new TopicBuilder()
      .withRandomId()
      .withOwner(new UserBuilder().withRandomId().build())
      .build();

    jest.spyOn(repository, 'findOneById').mockResolvedValueOnce(targetTopic);

    const result = await useCase.delete(requestUser, v4());
    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ForbiddenException);
  });
});

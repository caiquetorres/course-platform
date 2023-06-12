import { ForbiddenException, NotFoundException, Type } from '@nestjs/common';

import { UpdateTopicDto } from '../../../src/topic/presentation/update-topic.dto';

import { TopicRepository } from '../../../src/topic/infrastructure/repositories/topic.repository';
import { UpdateTopicUseCase } from '../../../src/topic/usecases/update-topic.usecase';
import { TopicBuilder } from '../../builders/topic/topic.builder';
import { UserBuilder } from '../../builders/user/user.builder';
import { TestBed } from '@automock/jest';
import { v4 } from 'uuid';

describe('UpdateTopicUseCase (unit)', () => {
  let useCase: UpdateTopicUseCase;
  let repository: TopicRepository;

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(UpdateTopicUseCase).compile();

    useCase = unit;
    repository = unitRef.get(TopicRepository as Type);
  });

  it('should create a topic', async () => {
    const requestUser = new UserBuilder().withRandomId().asUser().build();
    const targetTopic = new TopicBuilder()
      .withRandomId()
      .withOwner(requestUser)
      .build();

    jest.spyOn(repository, 'findOneById').mockResolvedValueOnce(targetTopic);
    jest.spyOn(repository, 'save').mockResolvedValueOnce(targetTopic);

    const dto = new UpdateTopicDto();
    dto.title = 'Software Engineering';

    const result = await useCase.update(requestUser, targetTopic.id, dto);
    expect(result.isRight()).toBeTruthy();
  });

  it('should throw a Not Found Exception when the topic does not exist', async () => {
    const requestUser = new UserBuilder().withRandomId().asUser().build();

    jest.spyOn(repository, 'findOneById').mockResolvedValueOnce(null);

    const dto = new UpdateTopicDto();
    dto.title = 'Software Engineering';

    const result = await useCase.update(requestUser, v4(), dto);
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

    const dto = new UpdateTopicDto();
    dto.title = 'Software Engineering';

    const result = await useCase.update(requestUser, v4(), dto);
    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ForbiddenException);
  });
});

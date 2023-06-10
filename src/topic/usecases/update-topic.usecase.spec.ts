import { ForbiddenException, NotFoundException, Type } from '@nestjs/common';

import { UpdateTopicDto } from '../presentation/update-topic.dto';

import { UserBuilder } from '../../user/domain/builders/user.builder';
import { TopicBuilder } from '../domain/builders/topic.builder';
import { TopicRepository } from '../infrastructure/repositories/topic.repository';
import { UpdateTopicUseCase } from './update-topic.usecase';
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

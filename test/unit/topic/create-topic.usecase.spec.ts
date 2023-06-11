import { ForbiddenException, Type } from '@nestjs/common';

import { CreateTopicDto } from '../../../src/topic/presentation/create-topic.dto';

import { TopicRepository } from '../../../src/topic/infrastructure/repositories/topic.repository';
import { CreateTopicUseCase } from '../../../src/topic/usecases/create-topic.usecase';
import { TopicBuilder } from '../../builders/topic/topic.builder';
import { UserBuilder } from '../../builders/user/user.builder';
import { TestBed } from '@automock/jest';

describe('CreateTopicUseCase (unit)', () => {
  let useCase: CreateTopicUseCase;
  let repository: TopicRepository;

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(CreateTopicUseCase).compile();

    useCase = unit;
    repository = unitRef.get(TopicRepository as Type);
  });

  it('should create a topic', async () => {
    const requestUser = new UserBuilder().withRandomId().asUser().build();
    const targetTopic = new TopicBuilder().withOwner(requestUser).build();

    jest.spyOn(repository, 'save').mockResolvedValueOnce(targetTopic);

    const dto = new CreateTopicDto();
    dto.title = 'Software Engineering';

    const result = await useCase.create(requestUser, dto);
    expect(result.isRight()).toBeTruthy();
  });

  it('should throw a Forbidden Exception when the user is a guest', async () => {
    const requestUser = new UserBuilder().withRandomId().asGuest().build();

    const dto = new CreateTopicDto();
    dto.title = 'Software Engineering';

    const result = await useCase.create(requestUser, dto);
    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ForbiddenException);
  });
});

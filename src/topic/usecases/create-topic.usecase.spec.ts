import { ForbiddenException, Type } from '@nestjs/common';

import { CreateTopicDto } from '../presentation/create-topic.dto';

import { UserBuilder } from '../../user/domain/builders/user.builder';
import { TopicBuilder } from '../domain/builders/topic.builder';
import { TopicRepository } from '../infrastructure/repositories/topic.repository';
import { CreateTopicUseCase } from './create-topic.usecase';
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

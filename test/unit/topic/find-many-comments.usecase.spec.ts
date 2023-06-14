import { NotFoundException, Type } from '@nestjs/common';

import { Comment } from '../../../src/topic/domain/models/comment';
import { Topic } from '../../../src/topic/domain/models/topic';

import { CommentRepository } from '../../../src/topic/infrastructure/repositories/comment.repository';
import { TopicRepository } from '../../../src/topic/infrastructure/repositories/topic.repository';
import { FindManyCommentsUseCase } from '../../../src/topic/usecases/find-many-comments.usecase';
import { UserBuilder } from '../../builders/user/user.builder';
import { TestBed } from '@automock/jest';
import { v4 } from 'uuid';

describe('FindManyCommentsUseCase (unit)', () => {
  let useCase: FindManyCommentsUseCase;
  let commentRepository: CommentRepository;
  let topicRepository: TopicRepository;

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(FindManyCommentsUseCase).compile();

    useCase = unit;
    commentRepository = unitRef.get(CommentRepository as Type);
    topicRepository = unitRef.get(TopicRepository as Type);
  });

  it('should list comments by topic id', async () => {
    const requestUser = new UserBuilder().withRandomId().asUser().build();

    jest
      .spyOn(topicRepository, 'findOneById')
      .mockResolvedValueOnce({} as Topic);

    jest.spyOn(commentRepository, 'findManyByTopic').mockResolvedValueOnce({
      cursor: null,
      data: [{}, {}, {}] as Comment[],
    });

    const result = await useCase.find(requestUser, v4(), {
      afterCursor: null,
      beforeCursor: null,
      limit: 10,
    });

    expect(result.isRight()).toBeTruthy();
  });

  it('should throw a Not Found Exception if the topic does not exist', async () => {
    const requestUser = new UserBuilder().withRandomId().asUser().build();

    jest.spyOn(topicRepository, 'findOneById').mockResolvedValueOnce(null);

    jest.spyOn(commentRepository, 'findManyByTopic').mockResolvedValueOnce({
      cursor: null,
      data: [{}, {}, {}] as Comment[],
    });

    const result = await useCase.find(requestUser, v4(), {
      afterCursor: null,
      beforeCursor: null,
      limit: 10,
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotFoundException);
  });

  it('should throw a Not Found Exception when the comment does not exist', async () => {
    const requestUser = new UserBuilder().withRandomId().asUser().build();

    jest
      .spyOn(topicRepository, 'findOneById')
      .mockResolvedValueOnce({} as Topic);

    jest.spyOn(commentRepository, 'findManyByTopic').mockResolvedValueOnce({
      cursor: null,
      data: [{}, {}, {}] as Comment[],
    });

    const result = await useCase.find(requestUser, v4(), {
      afterCursor: null,
      beforeCursor: null,
      limit: 10,
    });

    expect(result.isRight()).toBeTruthy();
  });
});

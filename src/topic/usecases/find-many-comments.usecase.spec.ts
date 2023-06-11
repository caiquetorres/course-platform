import { Type } from '@nestjs/common';

import { Comment } from '../domain/models/comment';
import { Topic } from '../domain/models/topic';

import { UserBuilder } from '../../user/domain/builders/user.builder';
import { CommentRepository } from '../infrastructure/repositories/comment.repository';
import { TopicRepository } from '../infrastructure/repositories/topic.repository';
import { FindManyCommentsUseCase } from './find-many-comments.usecase';
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

import { ForbiddenException, NotFoundException, Type } from '@nestjs/common';

import { Comment } from '../../../src/topic/domain/models/comment';
import { Topic } from '../../../src/topic/domain/models/topic';
import { CreateCommentDto } from '../../../src/topic/presentation/create-comment.dto';

import { CommentRepository } from '../../../src/topic/infrastructure/repositories/comment.repository';
import { TopicRepository } from '../../../src/topic/infrastructure/repositories/topic.repository';
import { CreateCommentUsecase } from '../../../src/topic/usecases/create-comment.usecase';
import { TopicBuilder } from '../../builders/topic/topic.builder';
import { UserBuilder } from '../../builders/user/user.builder';
import { TestBed } from '@automock/jest';
import { v4 } from 'uuid';

describe('CreateCommentUsecase (unit)', () => {
  let useCase: CreateCommentUsecase;
  let commentRepository: CommentRepository;
  let topicRepository: TopicRepository;

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(CreateCommentUsecase).compile();

    useCase = unit;
    commentRepository = unitRef.get(CommentRepository as Type);
    topicRepository = unitRef.get(TopicRepository as Type);
  });

  it('should create a comment', async () => {
    const requestUser = new UserBuilder().withRandomId().asUser().build();
    const targetTopic = new TopicBuilder().withOwner(requestUser).build();

    jest
      .spyOn(topicRepository, 'findOneById')
      .mockResolvedValueOnce({} as Topic);

    jest.spyOn(commentRepository, 'save').mockResolvedValueOnce({} as Comment);

    const dto = new CreateCommentDto();
    dto.text = 'Nice.';

    const result = await useCase.create(requestUser, targetTopic.id, dto);
    expect(result.isRight()).toBeTruthy();
  });

  it('should throw a Forbidden Exception when the user is a guest', async () => {
    const requestUser = new UserBuilder().withRandomId().asGuest().build();

    const dto = new CreateCommentDto();
    dto.text = 'Nice.';

    const result = await useCase.create(requestUser, v4(), dto);
    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ForbiddenException);
  });

  it('should throw a Not Found Exception when the topic does not exist', async () => {
    const requestUser = new UserBuilder().withRandomId().asUser().build();

    jest.spyOn(topicRepository, 'findOneById').mockResolvedValueOnce(null);

    const dto = new CreateCommentDto();
    dto.text = 'Nice.';

    const result = await useCase.create(requestUser, v4(), dto);

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotFoundException);
  });
});

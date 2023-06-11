import { NotFoundException, Type } from '@nestjs/common';

import { UserBuilder } from '../../user/domain/builders/user.builder';
import { CommentBuilder } from '../domain/builders/comment.builder';
import { CommentRepository } from '../infrastructure/repositories/comment.repository';
import { FeedbackRepository } from '../infrastructure/repositories/feedback.repository';
import { CountLikesUseCase } from './count-likes.usecase';
import { TestBed } from '@automock/jest';
import { v4 } from 'uuid';

describe('CountLikesUseCase (unit)', () => {
  let useCase: CountLikesUseCase;
  let feedbackRepository: FeedbackRepository;
  let commentRepository: CommentRepository;

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(CountLikesUseCase).compile();

    useCase = unit;
    feedbackRepository = unitRef.get(FeedbackRepository as Type);
    commentRepository = unitRef.get(CommentRepository as Type);
  });

  it('should deslike a comment', async () => {
    const requestUser = new UserBuilder().withRandomId().asUser().build();

    const targetComment = new CommentBuilder()
      .withRandomId()
      .withOwner(new UserBuilder().withRandomId().build())
      .build();

    jest
      .spyOn(commentRepository, 'findOneById')
      .mockResolvedValueOnce(targetComment);

    jest.spyOn(feedbackRepository, 'countByComment').mockResolvedValue(10);

    const result = await useCase.count(requestUser, targetComment.id);
    expect(result.isRight()).toBeTruthy();
    expect(result.value).toBe(10);
  });

  it('should throw a Not Found Exception comment does not exist', async () => {
    const requestUser = new UserBuilder().withRandomId().asUser().build();

    jest.spyOn(commentRepository, 'findOneById').mockResolvedValueOnce(null);

    const result = await useCase.count(requestUser, v4());
    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotFoundException);
  });
});

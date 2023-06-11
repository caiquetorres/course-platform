import { ForbiddenException, NotFoundException, Type } from '@nestjs/common';

import { CommentRepository } from '../../../src/topic/infrastructure/repositories/comment.repository';
import { FeedbackRepository } from '../../../src/topic/infrastructure/repositories/feedback.repository';
import { DeslikeCommentUseCase } from '../../../src/topic/usecases/deslike-comment.usecase';
import { UserBuilder } from '../../../test/builders/user/user.builder';
import { CommentBuilder } from '../../builders/topic/comment.builder';
import { FeedbackBuilder } from '../../builders/topic/feedback.builder';
import { TestBed } from '@automock/jest';
import { v4 } from 'uuid';

describe('DeslikeCommentUseCase (unit)', () => {
  let useCase: DeslikeCommentUseCase;
  let feedbackRepository: FeedbackRepository;
  let commentRepository: CommentRepository;

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(DeslikeCommentUseCase).compile();

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

    jest
      .spyOn(feedbackRepository, 'findByOwnerAndComment')
      .mockResolvedValueOnce(null);

    const result = await useCase.deslike(requestUser, targetComment.id);
    expect(result.isRight()).toBeTruthy();
    expect(feedbackRepository.remove).not.toHaveBeenCalled();
    expect(result).toBeDefined();
  });

  it('should clear the deslike', async () => {
    const requestUser = new UserBuilder().withRandomId().asUser().build();

    const targetComment = new CommentBuilder()
      .withRandomId()
      .withOwner(new UserBuilder().withRandomId().build())
      .build();

    const targetFeedback = new FeedbackBuilder()
      .withRandomId()
      .withStatus(false)
      .withComment(targetComment)
      .build();

    jest
      .spyOn(commentRepository, 'findOneById')
      .mockResolvedValueOnce(targetComment);

    jest
      .spyOn(feedbackRepository, 'findByOwnerAndComment')
      .mockResolvedValueOnce(targetFeedback);

    const result = await useCase.deslike(requestUser, targetComment.id);
    expect(result.isRight()).toBeTruthy();
    expect(feedbackRepository.remove).toHaveBeenCalled();
    expect(result).toBeDefined();
  });

  it('should throw a Forbidden Exception if the user has no permissions to deslike a comment', async () => {
    const requestUser = new UserBuilder().withRandomId().asGuest().build();

    const result = await useCase.deslike(requestUser, v4());
    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ForbiddenException);
  });

  it('should throw a Not Found Exception comment does not exist', async () => {
    const requestUser = new UserBuilder().withRandomId().asUser().build();

    jest.spyOn(commentRepository, 'findOneById').mockResolvedValueOnce(null);

    const result = await useCase.deslike(requestUser, v4());
    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotFoundException);
  });
});

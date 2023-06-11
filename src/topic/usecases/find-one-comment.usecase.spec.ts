import { NotFoundException, Type } from '@nestjs/common';

import { UserBuilder } from '../../user/domain/builders/user.builder';
import { CommentBuilder } from '../domain/builders/comment.builder';
import { CommentRepository } from '../infrastructure/repositories/comment.repository';
import { FindOneCommentUseCase } from './find-one-comment.usecase';
import { TestBed } from '@automock/jest';

describe('FindOneCommentUseCase (unit)', () => {
  let useCase: FindOneCommentUseCase;
  let repository: CommentRepository;

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(FindOneCommentUseCase).compile();

    useCase = unit;
    repository = unitRef.get(CommentRepository as Type);
  });

  it('should create a comment', async () => {
    const requestUser = new UserBuilder().withRandomId().asUser().build();
    const targetComment = new CommentBuilder().withOwner(requestUser).build();

    jest.spyOn(repository, 'findOneById').mockResolvedValueOnce(targetComment);

    const result = await useCase.find(requestUser, targetComment.id);
    expect(result.isRight()).toBeTruthy();
  });

  it('should throw a Not Found Exception when the topic does not exist', async () => {
    const requestUser = new UserBuilder().withRandomId().asUser().build();
    const targetComment = new CommentBuilder().withOwner(requestUser).build();

    jest.spyOn(repository, 'findOneById').mockResolvedValueOnce(null);

    const result = await useCase.find(requestUser, targetComment.id);

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotFoundException);
  });
});

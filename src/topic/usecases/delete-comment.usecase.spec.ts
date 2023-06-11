import { ForbiddenException, NotFoundException, Type } from '@nestjs/common';

import { UserBuilder } from '../../user/domain/builders/user.builder';
import { CommentBuilder } from '../domain/builders/comment.builder';
import { CommentRepository } from '../infrastructure/repositories/comment.repository';
import { DeleteCommentUseCase } from './delete-comment.usecase';
import { TestBed } from '@automock/jest';
import { v4 } from 'uuid';

describe('DeleteCommentUseCase (unit)', () => {
  let useCase: DeleteCommentUseCase;
  let repository: CommentRepository;

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(DeleteCommentUseCase).compile();

    useCase = unit;
    repository = unitRef.get(CommentRepository as Type);
  });

  it('should delete a comment', async () => {
    const requestUser = new UserBuilder().withRandomId().asUser().build();
    const targetComment = new CommentBuilder().withOwner(requestUser).build();

    jest.spyOn(repository, 'findOneById').mockResolvedValueOnce(targetComment);

    const result = await useCase.delete(requestUser, targetComment.id);
    expect(result.isRight()).toBeTruthy();
  });

  it('should throw a Not Found Exception if the comment does not exist', async () => {
    const requestUser = new UserBuilder().withRandomId().asUser().build();

    jest.spyOn(repository, 'findOneById').mockResolvedValueOnce(null);

    const result = await useCase.delete(requestUser, v4());
    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotFoundException);
  });

  it('should throw a Forbidden Exception if the user is not permitted of deleting the comment', async () => {
    const requestUser = new UserBuilder().withRandomId().asUser().build();
    const targetComment = new CommentBuilder()
      .withOwner(new UserBuilder().withRandomId().build())
      .build();

    jest.spyOn(repository, 'findOneById').mockResolvedValueOnce(targetComment);

    const result = await useCase.delete(requestUser, targetComment.id);
    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ForbiddenException);
  });
});

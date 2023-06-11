import { ForbiddenException, NotFoundException } from '@nestjs/common';

import { UserBuilder } from '../../user/domain/builders/user.builder';
import { ProjectBuilder } from '../domain/builders/project.builder';
import { ProjectRepository } from '../infrastructure/repositories/project.repository';
import { DeleteProjectUseCase } from './delete-project.usecase';
import { TestBed, Type } from '@automock/jest';
import { v4 } from 'uuid';

describe('DeleteProjectUseCase (unit)', () => {
  let useCase: DeleteProjectUseCase;
  let repository: ProjectRepository;

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(DeleteProjectUseCase).compile();

    useCase = unit;
    repository = unitRef.get(ProjectRepository as Type);
  });

  it('should update a project', async () => {
    const requestUser = new UserBuilder().withRandomId().asPro().build();

    const targetProject = new ProjectBuilder()
      .withRandomId()
      .withOwner(requestUser)
      .build();

    jest.spyOn(repository, 'findOneById').mockResolvedValueOnce(targetProject);

    const result = await useCase.delete(requestUser, targetProject.id);

    expect(result.isRight()).toBeTruthy();
  });

  it('should throw a Not Found Exception when the project does not exist', async () => {
    const requestUser = new UserBuilder().withRandomId().asUser().build();

    jest.spyOn(repository, 'findOneById').mockResolvedValueOnce(null);

    const result = await useCase.delete(requestUser, v4());
    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotFoundException);
  });

  it('should throw a Forbidden Exception when the is not the owner', async () => {
    const requestUser = new UserBuilder().withRandomId().asUser().build();

    const targetProject = new ProjectBuilder()
      .withRandomId()
      .withOwner(new UserBuilder().withRandomId().asPro().build())
      .build();

    jest.spyOn(repository, 'findOneById').mockResolvedValueOnce(targetProject);

    const result = await useCase.delete(requestUser, targetProject.id);
    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ForbiddenException);
  });
});

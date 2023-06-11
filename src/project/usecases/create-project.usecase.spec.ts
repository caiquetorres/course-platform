import { ForbiddenException } from '@nestjs/common';

import { CreateProjectDto } from '../presentation/create-project.dto';

import { UserBuilder } from '../../user/domain/builders/user.builder';
import { ProjectBuilder } from '../domain/builders/project.builder';
import { ProjectRepository } from '../infrastructure/repositories/project.repository';
import { CreateProjectUseCase } from './create-project.usecase';
import { TestBed, Type } from '@automock/jest';

describe('CreateProjectUseCase (unit)', () => {
  let useCase: CreateProjectUseCase;
  let repository: ProjectRepository;

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(CreateProjectUseCase).compile();

    useCase = unit;
    repository = unitRef.get(ProjectRepository as Type);
  });

  it('should create a project', async () => {
    const requestUser = new UserBuilder().withRandomId().asPro().build();

    const targetProject = new ProjectBuilder()
      .withRandomId()
      .withOwner(requestUser)
      .build();

    jest.spyOn(repository, 'save').mockResolvedValueOnce(targetProject);

    const dto = new CreateProjectDto();
    dto.name = 'Course Platform';
    dto.description = 'Lorem ipsum dolor si amet.';

    const result = await useCase.create(requestUser, dto);
    expect(result.isRight()).toBeTruthy();
    expect(result.value).toHaveProperty('name', targetProject.name);
  });

  it('should throw a Forbidden Exception when the is not a pro', async () => {
    const requestUser = new UserBuilder().withRandomId().asUser().build();

    const targetProject = new ProjectBuilder()
      .withRandomId()
      .withOwner(requestUser)
      .build();

    jest.spyOn(repository, 'save').mockResolvedValueOnce(targetProject);

    const dto = new CreateProjectDto();
    dto.name = 'Course Platform';
    dto.description = 'Lorem ipsum dolor si amet.';

    const result = await useCase.create(requestUser, dto);
    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ForbiddenException);
  });
});

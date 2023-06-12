import { ForbiddenException, NotFoundException } from '@nestjs/common';

import { CreateProjectDto } from '../../../src/project/presentation/create-project.dto';

import { ProjectBuilder } from '../../builders/project/project.builder';
import { ProjectRepository } from '../../../src/project/infrastructure/repositories/project.repository';
import { UpdateProjectUseCase } from '../../../src/project/usecases/update-project.usecase';
import { UserBuilder } from '../../builders/user/user.builder';
import { TestBed, Type } from '@automock/jest';
import { v4 } from 'uuid';

describe('UpdateProjectUseCase (unit)', () => {
  let useCase: UpdateProjectUseCase;
  let repository: ProjectRepository;

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(UpdateProjectUseCase).compile();

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
    jest.spyOn(repository, 'save').mockResolvedValueOnce(targetProject);

    const dto = new CreateProjectDto();
    dto.name = 'Course Platform';
    dto.description = 'Lorem ipsum dolor si amet.';

    const result = await useCase.update(requestUser, targetProject.id, dto);

    expect(result.isRight()).toBeTruthy();
  });

  it('should throw a Not Found Exception when the project does not exist', async () => {
    const requestUser = new UserBuilder().withRandomId().asUser().build();

    jest.spyOn(repository, 'findOneById').mockResolvedValueOnce(null);

    const dto = new CreateProjectDto();
    dto.name = 'Course Platform';
    dto.description = 'Lorem ipsum dolor si amet.';

    const result = await useCase.update(requestUser, v4(), dto);
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
    jest.spyOn(repository, 'save').mockResolvedValueOnce(targetProject);

    const dto = new CreateProjectDto();
    dto.name = 'Course Platform';
    dto.description = 'Lorem ipsum dolor si amet.';

    const result = await useCase.update(requestUser, targetProject.id, dto);
    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ForbiddenException);
  });
});

import {
  ConflictException,
  ForbiddenException,
  ImATeapotException,
  NotFoundException,
} from '@nestjs/common';

import { Application } from '../../../src/project/domain/models/application';

import { ApplicationRepository } from '../../../src/project/infrastructure/repositories/application.repository';
import { ProjectRepository } from '../../../src/project/infrastructure/repositories/project.repository';
import { ApplyToProjectUseCase } from '../../../src/project/usecases/apply-to-project.usecase';
import { ProjectBuilder } from '../../builders/project/project.builder';
import { UserBuilder } from '../../builders/user/user.builder';
import { TestBed, Type } from '@automock/jest';
import { v4 } from 'uuid';

describe('ApplyToProjectUseCase (unit)', () => {
  let useCase: ApplyToProjectUseCase;
  let applicationRepository: ApplicationRepository;
  let projectRepository: ProjectRepository;

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(ApplyToProjectUseCase).compile();

    useCase = unit;
    projectRepository = unitRef.get(ProjectRepository as Type);
    applicationRepository = unitRef.get(ApplicationRepository as Type);
  });

  it('should apply to a project', async () => {
    const targetProject = new ProjectBuilder()
      .withRandomId()
      .withOwner(new UserBuilder().withRandomId().build())
      .build();

    const requestUser = new UserBuilder().withRandomId().asPro().build();

    jest
      .spyOn(projectRepository, 'findOneById')
      .mockResolvedValueOnce(targetProject);

    jest
      .spyOn(applicationRepository, 'findByOwnerAndProject')
      .mockResolvedValueOnce(null);

    jest
      .spyOn(applicationRepository, 'save')
      .mockResolvedValueOnce({} as Application);

    const result = await useCase.apply(requestUser, targetProject.id);
    expect(result.isRight()).toBeTruthy();
    expect(result.value).toBeDefined();
  });

  it('should throw a Not Found Exception when the project does not exist', async () => {
    const requestUser = new UserBuilder().withRandomId().asPro().build();

    jest.spyOn(projectRepository, 'findOneById').mockResolvedValueOnce(null);

    const result = await useCase.apply(requestUser, v4());
    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotFoundException);
  });

  it('should throw a Forbidden Exception when the user has no permissions to apply to a project', async () => {
    const targetProject = new ProjectBuilder()
      .withRandomId()
      .withOwner(new UserBuilder().withRandomId().build())
      .build();

    const requestUser = new UserBuilder().withRandomId().asUser().build();

    jest
      .spyOn(projectRepository, 'findOneById')
      .mockResolvedValueOnce(targetProject);

    const result = await useCase.apply(requestUser, targetProject.id);
    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ForbiddenException);
  });

  it("should throw an I'm a Teapot Exception when the user is trying to apply to his own project", async () => {
    const requestUser = new UserBuilder().withRandomId().asPro().build();

    const targetProject = new ProjectBuilder()
      .withRandomId()
      .withOwner(requestUser)
      .build();

    jest
      .spyOn(projectRepository, 'findOneById')
      .mockResolvedValueOnce(targetProject);

    const result = await useCase.apply(requestUser, targetProject.id);
    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ImATeapotException);
  });

  it('should throw a Conflict Exception when the user has already applied to the project', async () => {
    const targetProject = new ProjectBuilder()
      .withRandomId()
      .withOwner(new UserBuilder().withRandomId().build())
      .build();

    const requestUser = new UserBuilder().withRandomId().asPro().build();

    jest
      .spyOn(projectRepository, 'findOneById')
      .mockResolvedValueOnce(targetProject);

    jest
      .spyOn(applicationRepository, 'findByOwnerAndProject')
      .mockResolvedValueOnce({} as Application);

    const result = await useCase.apply(requestUser, targetProject.id);
    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ConflictException);
  });
});

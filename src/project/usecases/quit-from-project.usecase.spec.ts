import { NotFoundException } from '@nestjs/common';

import { Application } from '../domain/models/application';
import { Project } from '../domain/models/project';

import { UserBuilder } from '../../user/domain/builders/user.builder';
import { ProjectBuilder } from '../domain/builders/project.builder';
import { ApplicationRepository } from '../infrastructure/repositories/application.repository';
import { ProjectRepository } from '../infrastructure/repositories/project.repository';
import { QuitFromProjectUseCase } from './quit-from-project.usecase';
import { TestBed, Type } from '@automock/jest';
import { v4 } from 'uuid';

describe('QuitFromProjectUseCase (unit)', () => {
  let useCase: QuitFromProjectUseCase;
  let applicationRepository: ApplicationRepository;
  let projectRepository: ProjectRepository;

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(QuitFromProjectUseCase).compile();

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
      .mockResolvedValueOnce({} as Application);

    jest.spyOn(applicationRepository, 'remove').mockResolvedValueOnce(null);

    const result = await useCase.quit(requestUser, targetProject.id);
    expect(result.isRight()).toBeTruthy();
  });

  it('should throw a Not Found Exception when the project does not exist', async () => {
    const requestUser = new UserBuilder().withRandomId().asPro().build();

    jest.spyOn(projectRepository, 'findOneById').mockResolvedValueOnce(null);

    const result = await useCase.quit(requestUser, v4());
    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotFoundException);
  });

  it('should throw a Not Found Exception when the application does not exist', async () => {
    const requestUser = new UserBuilder().withRandomId().asPro().build();

    jest
      .spyOn(projectRepository, 'findOneById')
      .mockResolvedValueOnce({} as Project);

    jest
      .spyOn(applicationRepository, 'findByOwnerAndProject')
      .mockResolvedValueOnce(null);

    const result = await useCase.quit(requestUser, v4());
    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotFoundException);
  });
});

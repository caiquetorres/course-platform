import { NotFoundException } from '@nestjs/common';

import { ProjectBuilder } from '../../builders/project/project.builder';
import { ProjectRepository } from '../../../src/project/infrastructure/repositories/project.repository';
import { FindOneProjectUseCase } from '../../../src/project/usecases/find-one-project.usecase';
import { UserBuilder } from '../../../test/builders/user/user.builder';
import { TestBed, Type } from '@automock/jest';
import { v4 } from 'uuid';

describe('FindOneProjectUseCase (unit)', () => {
  let useCase: FindOneProjectUseCase;
  let repository: ProjectRepository;

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(FindOneProjectUseCase).compile();

    useCase = unit;
    repository = unitRef.get(ProjectRepository as Type);
  });

  it('should get the request user', async () => {
    const requestUser = new UserBuilder().withRandomId().asGuest().build();
    const targetProject = new ProjectBuilder().withRandomId().build();

    jest.spyOn(repository, 'findOneById').mockResolvedValueOnce(targetProject);

    const result = await useCase.find(requestUser, requestUser.id);

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toBeDefined();
  });

  it('should throw a Not Found Exception when the id represents a project that does not exist', async () => {
    jest.spyOn(repository, 'findOneById').mockResolvedValueOnce(null);

    const requestUser = new UserBuilder().withRandomId().asAdmin().build();

    const result = await useCase.find(requestUser, v4());

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotFoundException);
  });
});

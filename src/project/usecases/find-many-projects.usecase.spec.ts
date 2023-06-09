import { Project } from '../domain/models/project';

import { UserBuilder } from '../../user/domain/builders/user.builder';
import { ProjectRepository } from '../infrastructure/repositories/project.repository';
import { FindManyProjectsUseCase } from './find-many-projects.usecase';
import { TestBed, Type } from '@automock/jest';

describe('FindManyProjectsUseCase (unit)', () => {
  let useCase: FindManyProjectsUseCase;
  let repository: ProjectRepository;

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(FindManyProjectsUseCase).compile();

    useCase = unit;
    repository = unitRef.get(ProjectRepository as Type);
  });

  it('should get the request user', async () => {
    const requestUser = new UserBuilder().withRandomId().asGuest().build();

    jest.spyOn(repository, 'findMany').mockResolvedValueOnce({
      cursor: null,
      data: [{}, {}, {}] as Project[],
    });

    const result = await useCase.find(requestUser, {
      afterCursor: null,
      beforeCursor: null,
      limit: 10,
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toBeDefined();
  });
});

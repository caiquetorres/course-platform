import {
  ForbiddenException,
  ImATeapotException,
  NotFoundException,
} from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Application } from '../entities/application.entity';
import { Project } from '../entities/project.entity';

import { ApplicationService } from './application.service';

import { UserFactory } from '../../user/factories/user.factory';
import { ProjectFactory } from '../factories/project.factory';
import { TestBed } from '@automock/jest';
import { v4 } from 'uuid';

describe('ApplicationService (unit)', () => {
  let applicationService: ApplicationService;
  let projectRepository: Repository<Project>;
  let applicationRepository: Repository<Application>;

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(ApplicationService).compile();

    applicationService = unit;
    applicationRepository = unitRef.get(
      getRepositoryToken(Application) as string,
    );
    projectRepository = unitRef.get(getRepositoryToken(Project) as string);
  });

  describe('Create one application', () => {
    it('should create an application', async () => {
      const projectId = v4();

      const defaultProject = new ProjectFactory()
        .withId(projectId)
        .withName('My First Project')
        .withOwner(new UserFactory().withId(v4()).build())
        .build();

      const saveMethod = jest.spyOn(applicationRepository, 'save');

      jest.spyOn(applicationRepository, 'findOne').mockResolvedValueOnce(null);

      jest
        .spyOn(projectRepository, 'findOne')
        .mockResolvedValueOnce(defaultProject);

      const requestUser = new UserFactory().withId(v4()).asPro().build();

      await applicationService.apply(requestUser, projectId);
      expect(saveMethod).toHaveBeenCalled();
    });

    it('should throw a Not Found Exception when the project does not exist', async () => {
      jest.spyOn(applicationRepository, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(projectRepository, 'findOne').mockResolvedValueOnce(null);

      const requestUser = new UserFactory().withId(v4()).asPro().build();

      expect(async () =>
        applicationService.apply(requestUser, v4()),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw a Forbidden Exception when the user is neither an admin nor a pro', async () => {
      let projectId = v4();

      let defaultProject = new ProjectFactory()
        .withId(projectId)
        .withName('My First Project')
        .withOwner(new UserFactory().withId(v4()).build())
        .build();

      jest
        .spyOn(projectRepository, 'findOne')
        .mockResolvedValueOnce(defaultProject);

      let requestUser = new UserFactory().withId(v4()).asUser().build();

      expect(async () =>
        applicationService.apply(requestUser, projectId),
      ).rejects.toThrow(ForbiddenException);

      projectId = v4();

      defaultProject = new ProjectFactory()
        .withId(projectId)
        .withName('My First Project')
        .withOwner(new UserFactory().withId(v4()).build())
        .build();

      jest
        .spyOn(projectRepository, 'findOne')
        .mockResolvedValueOnce(defaultProject);

      requestUser = new UserFactory().asGuest().build();

      expect(async () =>
        applicationService.apply(requestUser, projectId),
      ).rejects.toThrow(ForbiddenException);
    });

    it("should throw an I'm a Tea Pot when the is trying to apply to his own project", async () => {
      const userId = v4();
      const projectId = v4();

      const defaultProject = new ProjectFactory()
        .withId(projectId)
        .withName('My First Project')
        .withOwner(new UserFactory().withId(userId).build())
        .build();

      jest
        .spyOn(projectRepository, 'findOne')
        .mockResolvedValueOnce(defaultProject);

      const requestUser = new UserFactory().withId(userId).asPro().build();

      expect(async () =>
        applicationService.apply(requestUser, projectId),
      ).rejects.toThrow(ImATeapotException);
    });
  });

  describe('Delete one application', () => {
    it('should delete an application', async () => {
      const projectId = v4();

      const defaultProject = new ProjectFactory()
        .withId(projectId)
        .withName('My First Project')
        .withOwner(new UserFactory().withId(v4()).build())
        .build();

      jest
        .spyOn(applicationRepository, 'findOne')
        .mockResolvedValueOnce({} as any);

      jest
        .spyOn(projectRepository, 'findOne')
        .mockResolvedValueOnce(defaultProject);

      const requestUser = new UserFactory().withId(v4()).asPro().build();

      await applicationService.withdraw(requestUser, projectId);
    });

    it('should throw a Not Found Exception when the project does not exist', async () => {
      jest.spyOn(applicationRepository, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(projectRepository, 'findOne').mockResolvedValueOnce(null);

      const requestUser = new UserFactory().withId(v4()).asPro().build();

      expect(async () =>
        applicationService.withdraw(requestUser, v4()),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw a Forbidden Exception when the user has no permissions for deleting an application', async () => {
      const projectId = v4();

      const defaultProject = new ProjectFactory()
        .withId(projectId)
        .withName('My First Project')
        .withOwner(new UserFactory().withId(v4()).build())
        .build();

      jest
        .spyOn(applicationRepository, 'findOne')
        .mockResolvedValueOnce({} as any);

      jest
        .spyOn(projectRepository, 'findOne')
        .mockResolvedValueOnce(defaultProject);

      const requestUser = new UserFactory().withId(v4()).asUser().build();

      expect(async () =>
        applicationService.withdraw(requestUser, projectId),
      ).rejects.toThrow(ForbiddenException);
    });

    it("should throw an I'm a Tea Pot when the is trying to apply to his own project", async () => {
      const userId = v4();
      const projectId = v4();

      const defaultProject = new ProjectFactory()
        .withId(projectId)
        .withName('My First Project')
        .withOwner(new UserFactory().withId(userId).build())
        .build();

      jest
        .spyOn(projectRepository, 'findOne')
        .mockResolvedValueOnce(defaultProject);

      const requestUser = new UserFactory().withId(userId).asPro().build();

      expect(async () =>
        applicationService.withdraw(requestUser, projectId),
      ).rejects.toThrow(ImATeapotException);
    });
  });
});

import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../../user/entities/user.entity';
import { Project } from '../entities/project.entity';

import { CreateProjectDto } from '../dtos/create-project.dto';
import { UpdateProjectDto } from '../dtos/update-project.dto';

import { ProjectService } from './project.service';

import { UserFactory } from '../../user/factories/user.factory';
import { ProjectFactory } from '../factories/project.factory';
import { TestBed } from '@automock/jest';
import { v4 } from 'uuid';

describe('ProjectService (unit)', () => {
  let projectService: ProjectService;
  let projectRepository: Repository<Project>;
  let userRepository: Repository<User>;

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(ProjectService).compile();

    projectService = unit;
    projectRepository = unitRef.get(getRepositoryToken(Project) as string);
    userRepository = unitRef.get(getRepositoryToken(User) as string);
  });

  describe('Create one project', () => {
    it('should create one project', async () => {
      jest.spyOn(projectRepository, 'save').mockResolvedValueOnce({} as any);

      let requestUser = new UserFactory().asPro().build();

      let dto = new CreateProjectDto();
      dto.name = 'My First Project';

      let project = await projectService.createOne(requestUser, dto);
      expect(project).toBeDefined();

      jest.spyOn(projectRepository, 'save').mockResolvedValueOnce({} as any);

      requestUser = new UserFactory().asAdmin().build();

      dto = new CreateProjectDto();
      dto.name = 'My First Project';

      project = await projectService.createOne(requestUser, dto);
      expect(project).toBeDefined();
    });

    it('should create one project attached with the given user', async () => {
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValueOnce({} as any);
      jest.spyOn(projectRepository, 'save').mockResolvedValueOnce({} as any);

      const requestUser = new UserFactory().asAdmin().build();

      const dto = new CreateProjectDto();
      dto.name = 'My First Project';
      dto.ownerId = v4();

      const project = await projectService.createOne(requestUser, dto);
      expect(project).toBeDefined();
    });

    it('should throw a Forbidden Exception when a not permitted user is trying to create a project', () => {
      jest.spyOn(projectRepository, 'save').mockResolvedValueOnce({} as any);

      let requestUser = new UserFactory().asUser().build();

      let dto = new CreateProjectDto();
      dto.name = 'My First Project';

      expect(async () =>
        projectService.createOne(requestUser, dto),
      ).rejects.toThrow(ForbiddenException);

      jest.spyOn(projectRepository, 'save').mockResolvedValueOnce({} as any);

      requestUser = new UserFactory().asGuest().build();

      dto = new CreateProjectDto();
      dto.name = 'My First Project';

      expect(async () =>
        projectService.createOne(requestUser, dto),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('Find one project', () => {
    it('should return a project given its id', async () => {
      const id = v4();
      const requestUser = new UserFactory().asGuest().build();

      jest
        .spyOn(projectRepository, 'findOne')
        .mockResolvedValueOnce(
          new ProjectFactory().withId(id).withName('My First Project').build(),
        );

      const project = await projectService.findOne(requestUser, id);
      expect(project).toBeDefined();
    });

    it('should throw a Not Found Exception if the project does not exist', () => {
      const id = v4();
      const requestUser = new UserFactory().asGuest().build();

      jest.spyOn(projectRepository, 'findOne').mockResolvedValueOnce(null);

      expect(() => projectService.findOne(requestUser, id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('Updates one project', () => {
    it('should update one user', async () => {
      const id = v4();

      const requestUser = new UserFactory().withId(id).asPro().build();

      const fakeProject = new ProjectFactory()
        .withName('My First Project')
        .withOwner(requestUser)
        .build();

      jest.spyOn(projectRepository, 'save').mockResolvedValueOnce(fakeProject);
      jest
        .spyOn(projectRepository, 'findOne')
        .mockResolvedValueOnce(fakeProject);

      const dto = new UpdateProjectDto();
      dto.name = 'My Second Project';

      const project = await projectService.updateOne(requestUser, id, dto);
      expect(project).toBeDefined();
    });

    it('should throw a Not Found Exception if the project does not exist', async () => {
      const id = v4();

      jest.spyOn(projectRepository, 'findOne').mockResolvedValueOnce(null);

      const requestUser = new UserFactory().asAdmin().build();

      const dto = new UpdateProjectDto();
      dto.name = 'My Second Project';

      expect(() =>
        projectService.updateOne(requestUser, id, dto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw a Forbidden Exception if the request user is neither an admin nor the project owner', async () => {
      let projectId = v4();
      let userId = v4();

      let defaultProject = new ProjectFactory()
        .withId(projectId)
        .withName('My First Project')
        .withOwner(new UserFactory().withId(userId).build())
        .build();

      jest
        .spyOn(projectRepository, 'save')
        .mockResolvedValueOnce(defaultProject);

      jest
        .spyOn(projectRepository, 'findOne')
        .mockResolvedValueOnce(defaultProject);

      let requestUser = new UserFactory().asGuest().build();

      let dto = new UpdateProjectDto();
      dto.name = 'My Second Project';

      expect(() =>
        projectService.updateOne(requestUser, projectId, dto),
      ).rejects.toThrow(ForbiddenException);

      projectId = v4();
      userId = v4();

      defaultProject = new ProjectFactory()
        .withId(projectId)
        .withName('My First Project')
        .withOwner(new UserFactory().withId(userId).build())
        .build();

      jest
        .spyOn(projectRepository, 'save')
        .mockResolvedValueOnce(defaultProject);

      jest
        .spyOn(projectRepository, 'findOne')
        .mockResolvedValueOnce(defaultProject);

      requestUser = new UserFactory().withId(v4()).asUser().build();

      dto = new UpdateProjectDto();
      dto.name = 'My Second Project';

      expect(() =>
        projectService.updateOne(requestUser, projectId, dto),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('Deletes one project', () => {
    it('should delete one project', async () => {
      const userId = v4();
      const projectId = v4();

      const requestUser = new UserFactory().withId(userId).asPro().build();

      const defaultProject = new ProjectFactory()
        .withId(projectId)
        .withOwner(requestUser)
        .build();

      jest
        .spyOn(projectRepository, 'remove')
        .mockResolvedValueOnce(defaultProject);

      jest
        .spyOn(projectRepository, 'findOne')
        .mockResolvedValueOnce(defaultProject);

      const project = await projectService.deleteOne(requestUser, userId);
      expect(project).toBeDefined();
    });

    it('should throw a Not Found Exception if the project does not exist', async () => {
      const id = v4();

      jest.spyOn(projectRepository, 'findOne').mockResolvedValueOnce(null);

      const requestUser = new UserFactory().asAdmin().build();

      expect(() => projectService.deleteOne(requestUser, id)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw a Forbidden Exception if the request user is neither an admin nor the project owner', async () => {
      let projectId = v4();
      let userId = v4();

      let defaultProject = new ProjectFactory()
        .withId(projectId)
        .withName('My First Project')
        .withOwner(new UserFactory().withId(userId).build())
        .build();

      jest
        .spyOn(projectRepository, 'save')
        .mockResolvedValueOnce(defaultProject);

      jest
        .spyOn(projectRepository, 'findOne')
        .mockResolvedValueOnce(defaultProject);

      let requestUser = new UserFactory().asGuest().build();

      expect(() =>
        projectService.deleteOne(requestUser, projectId),
      ).rejects.toThrow(ForbiddenException);

      projectId = v4();
      userId = v4();

      defaultProject = new ProjectFactory()
        .withId(projectId)
        .withName('My First Project')
        .withOwner(new UserFactory().withId(userId).build())
        .build();

      jest
        .spyOn(projectRepository, 'save')
        .mockResolvedValueOnce(defaultProject);

      jest
        .spyOn(projectRepository, 'findOne')
        .mockResolvedValueOnce(defaultProject);

      requestUser = new UserFactory().withId(v4()).asUser().build();

      expect(() =>
        projectService.deleteOne(requestUser, projectId),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});

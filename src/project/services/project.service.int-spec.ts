import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../../user/entities/user.entity';
import { Project } from '../entities/project.entity';

import { CreateProjectDto } from '../dtos/create-project.dto';
import { UpdateProjectDto } from '../dtos/update-project.dto';

import { ProjectService } from './project.service';

import { UserFactory } from '../../user/factories/user.factory';
import { UserModule } from '../../user/user.module';
import { Email } from '../../user/value-objects/email';
import { Password } from '../../user/value-objects/password';
import { PROJECT_SERVICE } from '../constants/project.constant';
import { ProjectFactory } from '../factories/project.factory';
import { ProjectModule } from '../project.module';
import path from 'path';
import { v4 } from 'uuid';

describe('ProjectService (int)', () => {
  let projectService: ProjectService;
  let userRepository: Repository<User>;
  let projectRepository: Repository<Project>;

  beforeEach(async () => {
    const entities = path.resolve(__dirname, '../../**/entities/*.ts');

    const moduleRef = await Test.createTestingModule({
      imports: [
        UserModule,
        ProjectModule,
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          dropSchema: true,
          synchronize: true,
          entities: [entities],
        }),
      ],
    }).compile();

    projectService = moduleRef.get(PROJECT_SERVICE);
    projectRepository = moduleRef.get(getRepositoryToken(Project));
    userRepository = moduleRef.get(getRepositoryToken(User));
  });

  describe('Create one project', () => {
    it('should create on project', async () => {
      const requestUser = new UserFactory().asPro().build();

      const dto = new CreateProjectDto();
      dto.name = 'My First Project';

      const project = await projectService.createOne(requestUser, dto);

      expect(project).toBeDefined();
      expect(project).toHaveProperty('id');
    });
  });

  describe('Find one project', () => {
    it('should find one project', async () => {
      let owner = new UserFactory()
        .withId(v4())
        .withName('Jane Doe')
        .withUsername('janedoe')
        .withEmail(new Email('jane.doe@email.com'))
        .withPassword(new Password('JaneDoe123*'))
        .asPro()
        .build();

      delete owner.id;
      owner = await userRepository.save(owner);

      let project = new ProjectFactory()
        .withName('My First Project')
        .withOwner(owner)
        .build();

      delete project.id;
      project = await projectRepository.save(project);

      const requestUser = new UserFactory().withId(v4()).asUser().build();
      const user = await projectService.findOne(requestUser, project.id);

      expect(user).toBeDefined();
    });

    it('should throw a Not Found Exception if the project does not exist', async () => {
      const requestUser = new UserFactory().withId(v4()).asUser().build();
      expect(async () =>
        projectService.findOne(requestUser, v4()),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('Updates one project', () => {
    it('should update one project', async () => {
      let owner = new UserFactory()
        .withId(v4())
        .withName('Jane Doe')
        .withUsername('janedoe')
        .withEmail(new Email('jane.doe@email.com'))
        .withPassword(new Password('JaneDoe123*'))
        .asPro()
        .build();

      delete owner.id;
      owner = await userRepository.save(owner);

      let project = new ProjectFactory()
        .withName('My First Project')
        .withOwner(owner)
        .build();

      delete project.id;
      project = await projectRepository.save(project);

      const requestUser = new UserFactory().withId(owner.id).asPro().build();

      const dto = new UpdateProjectDto();
      dto.name = 'My Second Project';

      project = await projectService.updateOne(requestUser, project.id, dto);

      expect(project).toBeDefined();
      expect(project).toHaveProperty('name', 'My Second Project');
    });

    it('should throw a Not Found Exception if the project does not exist', async () => {
      const requestUser = new UserFactory().withId(v4()).asUser().build();

      const dto = new UpdateProjectDto();
      dto.name = 'My Second Project';

      expect(async () =>
        projectService.updateOne(requestUser, v4(), dto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('Deletes one project', () => {
    it('should delete one project', async () => {
      let owner = new UserFactory()
        .withId(v4())
        .withName('Jane Doe')
        .withUsername('janedoe')
        .withEmail(new Email('jane.doe@email.com'))
        .withPassword(new Password('JaneDoe123*'))
        .asPro()
        .build();

      delete owner.id;
      owner = await userRepository.save(owner);

      let project = new ProjectFactory()
        .withName('My First Project')
        .withOwner(owner)
        .build();

      delete project.id;
      project = await projectRepository.save(project);

      const requestUser = new UserFactory().withId(owner.id).asPro().build();

      project = await projectService.deleteOne(requestUser, project.id);

      expect(project).toBeDefined();
      expect(project).toHaveProperty('id', undefined);
    });

    it('should throw a Not Found Exception if the project does not exist', async () => {
      const requestUser = new UserFactory().withId(v4()).asUser().build();

      expect(async () =>
        projectService.deleteOne(requestUser, v4()),
      ).rejects.toThrow(NotFoundException);
    });
  });
});

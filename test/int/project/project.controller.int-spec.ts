import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Project } from '../../../src/project/domain/models/project';
import { CreateProjectDto } from '../../../src/project/presentation/create-project.dto';
import { UpdateProjectDto } from '../../../src/project/presentation/update-project.dto';
import { Role } from '../../../src/user/domain/models/role.enum';
import { User } from '../../../src/user/domain/models/user';

import { ProjectController } from '../../../src/project/presentation/project.controller';

import { LogRepository } from '../../../src/log/infrastructure/repositories/log.repository';
import { ProjectRepository } from '../../../src/project/infrastructure/repositories/project.repository';
import { ProjectModule } from '../../../src/project/project.module';
import { Email } from '../../../src/user/domain/value-objects/email';
import { Password } from '../../../src/user/domain/value-objects/password';
import { Username } from '../../../src/user/domain/value-objects/username';
import { UserRepository } from '../../../src/user/infrastructure/repositories/user.repository';
import { UserModule } from '../../../src/user/user.module';
import { UserBuilder } from '../../builders/user/user.builder';
import path from 'path';

describe('ProjectController (int)', () => {
  let controller: ProjectController;
  let repository: ProjectRepository;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const entitiesPath = path.resolve(__dirname, '../../../src/**/*.entity.ts');

    const moduleRef = await Test.createTestingModule({
      imports: [
        ProjectModule,
        UserModule,
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          dropSchema: true,
          synchronize: true,
          entities: [entitiesPath],
        }),
      ],
    })
      .overrideProvider(LogRepository)
      .useValue(null)
      .compile();

    controller = moduleRef.get(ProjectController);
    repository = moduleRef.get(ProjectRepository);
    userRepository = moduleRef.get(UserRepository);
  });

  it('should create a new project', async () => {
    const requestUser = await userRepository.save(
      new User({
        name: 'Jane Doe',
        email: new Email('janedoe@email.com'),
        username: new Username('janedoe'),
        password: Password.from('JaneDoe123*'),
        roles: new Set([Role.pro]),
      }),
    );

    const dto = new CreateProjectDto();
    dto.name = 'Course Platform';
    dto.description = 'Lorem ipsum dolor si amet.';

    const project = await controller.createOne(requestUser, dto);

    expect(project).toBeDefined();
    expect(project).toHaveProperty('name', dto.name);
    expect(project).toHaveProperty('description', dto.description);
  });

  it('should get the project by id', async () => {
    const owner = await userRepository.save(
      new User({
        name: 'Jane Doe',
        email: new Email('janedoe@email.com'),
        username: new Username('janedoe'),
        password: Password.from('JaneDoe123*'),
        roles: new Set([Role.pro]),
      }),
    );

    const targetProject = await repository.save(
      new Project({
        name: 'Course platform',
        description: 'Lorem ipsum dolor si amet.',
        owner,
      }),
    );

    const requestUser = new UserBuilder().withRandomId().asGuest().build();

    const project = await controller.findOne(requestUser, targetProject.id);

    expect(project).toBeDefined();
    expect(project).toHaveProperty('name', targetProject.name);
    expect(project).toHaveProperty('description', targetProject.description);
  });

  it('should get courses paginated', async () => {
    const owner = await userRepository.save(
      new User({
        name: 'Jane Doe',
        email: new Email('janedoe@email.com'),
        username: new Username('janedoe'),
        password: Password.from('JaneDoe123*'),
        roles: new Set([Role.pro]),
      }),
    );

    const projects = [
      new Project({
        name: 'Course Platform I',
        description: 'Lorem ipsum dolor si amet.',
        owner,
      }),
      new Project({
        name: 'Course Platform II',
        description: 'Lorem ipsum dolor si amet.',
        owner,
      }),
      new Project({
        name: 'Course Platform III',
        description: 'Lorem ipsum dolor si amet.',
        owner,
      }),
    ];

    for (const project of projects) {
      await repository.save(project);
    }

    const requestUser = new UserBuilder().asGuest().build();

    const result = await controller.findMany(requestUser, {
      afterCursor: null,
      beforeCursor: null,
      limit: 3,
    });

    expect(result).toHaveProperty('data');
    expect(result.data.length).toBe(3);
  });

  it('should update the project', async () => {
    const owner = await userRepository.save(
      new User({
        name: 'Jane Doe',
        email: new Email('janedoe@email.com'),
        username: new Username('janedoe'),
        password: Password.from('JaneDoe123*'),
        roles: new Set([Role.author]),
      }),
    );

    const targetProject = await repository.save(
      new Project({
        name: 'Course platform',
        description: 'Lorem ipsum dolor si amet.',
        owner,
      }),
    );

    const requestUser = owner;

    const dto = new UpdateProjectDto();
    dto.name = 'Course Platform I';

    const result = await controller.updateOne(
      requestUser,
      targetProject.id,
      dto,
    );

    expect(result).toHaveProperty('name', dto.name);
  });

  it('should delete the project', async () => {
    const owner = await userRepository.save(
      new User({
        name: 'Jane Doe',
        email: new Email('janedoe@email.com'),
        username: new Username('janedoe'),
        password: Password.from('JaneDoe123*'),
        roles: new Set([Role.author]),
      }),
    );

    const targetProject = await repository.save(
      new Project({
        name: 'Course platform',
        description: 'Lorem ipsum dolor si amet.',
        owner,
      }),
    );

    const requestUser = owner;

    const result = await controller.deleteOne(requestUser, targetProject.id);
    expect(result).toBeUndefined();
  });
});

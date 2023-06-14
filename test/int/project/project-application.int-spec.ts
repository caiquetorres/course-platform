import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Project } from '../../../src/project/domain/models/project';
import { Role } from '../../../src/user/domain/models/role.enum';
import { User } from '../../../src/user/domain/models/user';

import { ProjectApplicationController } from '../../../src/project/presentation/project-application.controller';

import { LogRepository } from '../../../src/log/infrastructure/repositories/log.repository';
import { ApplicationRepository } from '../../../src/project/infrastructure/repositories/application.repository';
import { ProjectRepository } from '../../../src/project/infrastructure/repositories/project.repository';
import { ProjectModule } from '../../../src/project/project.module';
import { Email } from '../../../src/user/domain/value-objects/email';
import { Password } from '../../../src/user/domain/value-objects/password';
import { Username } from '../../../src/user/domain/value-objects/username';
import { UserRepository } from '../../../src/user/infrastructure/repositories/user.repository';
import { UserModule } from '../../../src/user/user.module';
import { ApplicationBuilder } from '../../builders/project/application.builder';
import path from 'path';

describe('ProjectApplicationController (int)', () => {
  let controller: ProjectApplicationController;
  let projectRepository: ProjectRepository;
  let applicationRepository: ApplicationRepository;
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

    controller = moduleRef.get(ProjectApplicationController);
    projectRepository = moduleRef.get(ProjectRepository);
    applicationRepository = moduleRef.get(ApplicationRepository);
    userRepository = moduleRef.get(UserRepository);
  });

  it('should apply to a project', async () => {
    const requestUser = await userRepository.save(
      new User({
        name: 'John Doe',
        email: new Email('johndoe@email.com'),
        username: new Username('johndoe'),
        password: Password.from('JohnDoe123*'),
        roles: new Set([Role.pro]),
      }),
    );

    const owner = await userRepository.save(
      new User({
        name: 'Jane Doe',
        email: new Email('janedoe@email.com'),
        username: new Username('janedoe'),
        password: Password.from('JaneDoe123*'),
        roles: new Set([Role.pro]),
      }),
    );

    const targetProject = await projectRepository.save(
      new Project({
        name: 'Course platform',
        description: 'Lorem ipsum dolor si amet.',
        owner,
      }),
    );

    const result = await controller.apply(requestUser, targetProject.id);
    expect(result).toBeUndefined();
  });

  it('should quit from the project', async () => {
    const requestUser = await userRepository.save(
      new User({
        name: 'John Doe',
        email: new Email('johndoe@email.com'),
        username: new Username('johndoe'),
        password: Password.from('JohnDoe123*'),
        roles: new Set([Role.pro]),
      }),
    );

    const owner = await userRepository.save(
      new User({
        name: 'Jane Doe',
        email: new Email('janedoe@email.com'),
        username: new Username('janedoe'),
        password: Password.from('JaneDoe123*'),
        roles: new Set([Role.pro]),
      }),
    );

    const targetProject = await projectRepository.save(
      new Project({
        name: 'Course platform',
        description: 'Lorem ipsum dolor si amet.',
        owner,
      }),
    );

    const application = new ApplicationBuilder()
      .asWaitListed()
      .withOwner(requestUser)
      .withProject(targetProject)
      .build();

    await applicationRepository.save(application);

    const result = await controller.quit(requestUser, targetProject.id);
    expect(result).toBeUndefined();
  });
});

import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Topic } from '../../../src/topic/domain/models/topic';
import { CreateTopicDto } from '../../../src/topic/presentation/create-topic.dto';
import { Role } from '../../../src/user/domain/models/role.enum';
import { User } from '../../../src/user/domain/models/user';

import { TopicController } from '../../../src/topic/presentation/topic.controller';

import { LogRepository } from '../../../src/log/infrastructure/repositories/log.repository';
import { TopicRepository } from '../../../src/topic/infrastructure/repositories/topic.repository';
import { TopicModule } from '../../../src/topic/topic.module';
import { Email } from '../../../src/user/domain/value-objects/email';
import { Password } from '../../../src/user/domain/value-objects/password';
import { Username } from '../../../src/user/domain/value-objects/username';
import { UserRepository } from '../../../src/user/infrastructure/repositories/user.repository';
import { UserModule } from '../../../src/user/user.module';
import { UserBuilder } from '../../builders/user/user.builder';
import path from 'path';

describe('ProjectController (int)', () => {
  let controller: TopicController;
  let repository: TopicRepository;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const entitiesPath = path.resolve(__dirname, '../../../src/**/*.entity.ts');

    const moduleRef = await Test.createTestingModule({
      imports: [
        UserModule,
        TopicModule,
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

    controller = moduleRef.get(TopicController);
    repository = moduleRef.get(TopicRepository);
    userRepository = moduleRef.get(UserRepository);
  });

  it('should create a new topic', async () => {
    const requestUser = await userRepository.save(
      new User({
        name: 'John Doe',
        email: new Email('johndoe@email.com'),
        username: new Username('johndoe'),
        password: Password.from('JohnDoe123*'),
        roles: new Set([Role.user]),
      }),
    );

    const dto = new CreateTopicDto();
    dto.title = 'Software Engineering';

    const topic = await controller.createOne(requestUser, dto);

    expect(topic).toBeDefined();
    expect(topic).toHaveProperty('title', dto.title);
  });

  it('should get the topic by id', async () => {
    const owner = await userRepository.save(
      new User({
        name: 'Jane Doe',
        email: new Email('janedoe@email.com'),
        username: new Username('janedoe'),
        password: Password.from('JaneDoe123*'),
        roles: new Set([Role.user]),
      }),
    );

    const topic = await repository.save(
      new Topic({
        title: 'Software Engineering',
        owner,
      }),
    );

    const requestUser = new UserBuilder().withRandomId().asUser().build();

    const result = await controller.findOne(requestUser, topic.id);
    expect(result).toBeDefined();
    expect(result).toHaveProperty('title', 'Software Engineering');
  });

  it('should get topics paginated', async () => {
    const owner = await userRepository.save(
      new User({
        name: 'Jane Doe',
        email: new Email('janedoe@email.com'),
        username: new Username('janedoe'),
        password: Password.from('JaneDoe123*'),
        roles: new Set([Role.user]),
      }),
    );

    const topics = [
      new Topic({
        title: 'Software Engineering I',
        owner,
      }),
      new Topic({
        title: 'Software Engineering II',
        owner,
      }),
      new Topic({
        title: 'Software Engineering III',
        owner,
      }),
    ];

    for (const topic of topics) {
      await repository.save(topic);
    }

    const requestUser = new UserBuilder().withRandomId().asUser().build();

    const result = await controller.findMany(requestUser, {
      afterCursor: null,
      beforeCursor: null,
      limit: 3,
    });

    expect(result).toBeDefined();
    expect(result).toHaveProperty('data');
    expect(result.data.length).toBe(3);
  });

  it('should delete the topic', async () => {
    const owner = await userRepository.save(
      new User({
        name: 'Jane Doe',
        email: new Email('janedoe@email.com'),
        username: new Username('janedoe'),
        password: Password.from('JaneDoe123*'),
        roles: new Set([Role.user]),
      }),
    );

    const topic = await repository.save(
      new Topic({
        title: 'Software Engineering',
        owner,
      }),
    );

    const requestUser = owner;

    const result = await controller.deleteOne(requestUser, topic.id);
    expect(result).toBeUndefined();
  });
});

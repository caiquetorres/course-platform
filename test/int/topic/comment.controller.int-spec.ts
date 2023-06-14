import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Comment } from '../../../src/topic/domain/models/comment';
import { Topic } from '../../../src/topic/domain/models/topic';
import { Role } from '../../../src/user/domain/models/role.enum';
import { User } from '../../../src/user/domain/models/user';

import { CommentController } from '../../../src/topic/presentation/comment.controller';

import { LogRepository } from '../../../src/log/infrastructure/repositories/log.repository';
import { CommentRepository } from '../../../src/topic/infrastructure/repositories/comment.repository';
import { TopicRepository } from '../../../src/topic/infrastructure/repositories/topic.repository';
import { TopicModule } from '../../../src/topic/topic.module';
import { Email } from '../../../src/user/domain/value-objects/email';
import { Password } from '../../../src/user/domain/value-objects/password';
import { Username } from '../../../src/user/domain/value-objects/username';
import { UserRepository } from '../../../src/user/infrastructure/repositories/user.repository';
import { UserModule } from '../../../src/user/user.module';
import { UserBuilder } from '../../builders/user/user.builder';
import path from 'path';

describe('CommentController (int)', () => {
  let controller: CommentController;
  let topicRepository: TopicRepository;
  let commentRepository: CommentRepository;
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

    controller = moduleRef.get(CommentController);
    commentRepository = moduleRef.get(CommentRepository);
    topicRepository = moduleRef.get(TopicRepository);
    userRepository = moduleRef.get(UserRepository);
  });

  it('should get a comment given its id', async () => {
    const commentOwner = await userRepository.save(
      new User({
        name: 'John Doe',
        email: new Email('johndoe@email.com'),
        username: new Username('johndoe'),
        password: Password.from('JohnDoe123*'),
        roles: new Set([Role.user]),
      }),
    );

    const topicOwner = await userRepository.save(
      new User({
        name: 'Jane Doe',
        email: new Email('janedoe@email.com'),
        username: new Username('janedoe'),
        password: Password.from('JaneDoe123*'),
        roles: new Set([Role.user]),
      }),
    );

    const topic = await topicRepository.save(
      new Topic({
        title: 'Software Engineering',
        owner: topicOwner,
      }),
    );

    const comment = await commentRepository.save(
      new Comment({
        text: 'Nice.',
        owner: commentOwner,
        topic,
      }),
    );

    const requestUser = new UserBuilder().withRandomId().asUser().build();

    const result = await controller.findOne(requestUser, comment.id);

    expect(result).toBeDefined();
    expect(result).toHaveProperty('text', 'Nice.');
  });

  it('should delete a comment', async () => {
    const commentOwner = await userRepository.save(
      new User({
        name: 'John Doe',
        email: new Email('johndoe@email.com'),
        username: new Username('johndoe'),
        password: Password.from('JohnDoe123*'),
        roles: new Set([Role.user]),
      }),
    );

    const topicOwner = await userRepository.save(
      new User({
        name: 'Jane Doe',
        email: new Email('janedoe@email.com'),
        username: new Username('janedoe'),
        password: Password.from('JaneDoe123*'),
        roles: new Set([Role.user]),
      }),
    );

    const topic = await topicRepository.save(
      new Topic({
        title: 'Software Engineering',
        owner: topicOwner,
      }),
    );

    const comment = await commentRepository.save(
      new Comment({
        text: 'Nice.',
        owner: commentOwner,
        topic,
      }),
    );

    const requestUser = commentOwner;
    const result = await controller.deleteOne(requestUser, comment.id);

    expect(result).toBeUndefined();
  });
});

import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Comment } from '../../../src/topic/domain/models/comment';
import { Topic } from '../../../src/topic/domain/models/topic';
import { CreateCommentDto } from '../../../src/topic/presentation/create-comment.dto';
import { Role } from '../../../src/user/domain/models/role.enum';
import { User } from '../../../src/user/domain/models/user';

import { TopicCommentsController } from '../../../src/topic/presentation/topic-comments.controller';

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

describe('TopicCommentController (int)', () => {
  let controller: TopicCommentsController;
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

    controller = moduleRef.get(TopicCommentsController);
    commentRepository = moduleRef.get(CommentRepository);
    topicRepository = moduleRef.get(TopicRepository);
    userRepository = moduleRef.get(UserRepository);
  });

  it('should create a comment', async () => {
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

    const dto = new CreateCommentDto();
    dto.text = 'Nice.';

    const requestUser = commentOwner;

    const result = await controller.createOne(requestUser, topic.id, dto);

    expect(result).toBeDefined();
    expect(result).toHaveProperty('text', 'Nice.');
  });

  it('should get many comments given a topic', async () => {
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

    const comments = [
      new Comment({
        text: 'Nice I.',
        topic,
        owner: commentOwner,
      }),
      new Comment({
        text: 'Nice II.',
        topic,
        owner: commentOwner,
      }),
      new Comment({
        text: 'Nice II.',
        topic,
        owner: commentOwner,
      }),
    ];

    for (const comment of comments) {
      await commentRepository.save(comment);
    }

    const requestUser = new UserBuilder().withRandomId().asGuest().build();

    const result = await controller.findMany(requestUser, topic.id, {
      afterCursor: null,
      beforeCursor: null,
      limit: 3,
    });

    expect(result).toBeDefined();
    expect(result).toHaveProperty('data');
    expect(result.data.length).toBe(3);
  });
});

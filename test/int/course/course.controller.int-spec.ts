import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Course } from '../../../src/course/domain/models/course';
import { CreateCourseDto } from '../../../src/course/presentation/create-course.dto';
import { UpdateCourseDto } from '../../../src/course/presentation/update-course.dto';
import { Role } from '../../../src/user/domain/models/role.enum';
import { User } from '../../../src/user/domain/models/user';

import { CourseController } from '../../../src/course/presentation/course.controller';

import { CourseModule } from '../../../src/course/course.module';
import { CourseRepository } from '../../../src/course/infrastructure/repositories/course.repository';
import { LogRepository } from '../../../src/log/infrastructure/repositories/log.repository';
import { Email } from '../../../src/user/domain/value-objects/email';
import { Password } from '../../../src/user/domain/value-objects/password';
import { Username } from '../../../src/user/domain/value-objects/username';
import { UserRepository } from '../../../src/user/infrastructure/repositories/user.repository';
import { UserModule } from '../../../src/user/user.module';
import { UserBuilder } from '../../builders/user/user.builder';
import path from 'path';

describe('CourseController (int)', () => {
  let controller: CourseController;
  let repository: CourseRepository;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const entitiesPath = path.resolve(__dirname, '../../../src/**/*.entity.ts');

    const moduleRef = await Test.createTestingModule({
      imports: [
        UserModule,
        CourseModule,
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

    controller = moduleRef.get(CourseController);
    repository = moduleRef.get(CourseRepository);
    userRepository = moduleRef.get(UserRepository);
  });

  it('should create a new course', async () => {
    const requestUser = await userRepository.save(
      new User({
        name: 'Jane Doe',
        email: new Email('janedoe@email.com'),
        username: new Username('janedoe'),
        password: Password.from('JaneDoe123*'),
        roles: new Set([Role.author]),
      }),
    );

    const dto = new CreateCourseDto();
    dto.name = 'Software Engineering';
    dto.price = 120;

    const course = await controller.createOne(requestUser, dto);

    expect(course).toBeDefined();
    expect(course).toHaveProperty('name', dto.name);
    expect(course).toHaveProperty('price', dto.price);
  });

  it('should get the course by id', async () => {
    const owner = await userRepository.save(
      new User({
        name: 'Jane Doe',
        email: new Email('janedoe@email.com'),
        username: new Username('janedoe'),
        password: Password.from('JaneDoe123*'),
        roles: new Set([Role.author]),
      }),
    );

    const targetCourse = await repository.save(
      new Course({
        name: 'Software Engineering',
        owner,
      }),
    );

    const requestUser = new UserBuilder().asGuest().build();

    const result = await controller.findOne(requestUser, targetCourse.id);
    expect(result).toHaveProperty('name', targetCourse.name);
    expect(result).toHaveProperty('price', 0);
  });

  it('should get courses paginated', async () => {
    const owner = await userRepository.save(
      new User({
        name: 'Jane Doe',
        email: new Email('janedoe@email.com'),
        username: new Username('janedoe'),
        password: Password.from('JaneDoe123*'),
        roles: new Set([Role.author]),
      }),
    );

    const courses = [
      new Course({
        name: 'Software Engineering I',
        owner,
      }),
      new Course({
        name: 'Software Engineering II',
        owner,
      }),
      new Course({
        name: 'Software Engineering III',
        owner,
      }),
    ];

    for (const course of courses) {
      await repository.save(course);
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

  it('should update the course', async () => {
    const owner = await userRepository.save(
      new User({
        name: 'Jane Doe',
        email: new Email('janedoe@email.com'),
        username: new Username('janedoe'),
        password: Password.from('JaneDoe123*'),
        roles: new Set([Role.author]),
      }),
    );

    const targetCourse = await repository.save(
      new Course({
        name: 'Software Engineering',
        owner,
      }),
    );

    const requestUser = owner;

    const dto = new UpdateCourseDto();
    dto.name = 'Software Engineering I';

    const result = await controller.updateOne(
      requestUser,
      targetCourse.id,
      dto,
    );

    expect(result).toHaveProperty('name', dto.name);
  });

  it('should delete the course', async () => {
    const owner = await userRepository.save(
      new User({
        name: 'Jane Doe',
        email: new Email('janedoe@email.com'),
        username: new Username('janedoe'),
        password: Password.from('JaneDoe123*'),
        roles: new Set([Role.author]),
      }),
    );

    const targetCourse = await repository.save(
      new Course({
        name: 'Software Engineering',
        owner,
      }),
    );

    const requestUser = owner;

    const result = await controller.deleteOne(requestUser, targetCourse.id);
    expect(result).toBeUndefined();
  });
});

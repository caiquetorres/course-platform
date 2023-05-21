import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Course } from '../entities/course.entity';

import { CreateCourseDto } from '../dtos/create-course.dto';
import { UpdateCourseDto } from '../dtos/update-course.dto';

import { CourseService } from './course.service';

import { UserFactory } from '../../user/factories/user.factory';
import { COURSE_SERVICE } from '../constants/course.constant';
import { CourseModule } from '../course.module';
import { CourseFactory } from '../factories/course.factory';
import { Price } from '../value-objects/price';
import path from 'path';
import { v4 } from 'uuid';

describe('CourseService (int)', () => {
  let courseService: CourseService;
  let courseRepository: Repository<Course>;

  beforeEach(async () => {
    const entities = path.resolve(__dirname, '../../**/entities/*.ts');

    const moduleRef = await Test.createTestingModule({
      imports: [
        CourseModule,
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          dropSchema: true,
          synchronize: true,
          entities: [entities],
        }),
      ],
    }).compile();

    courseService = moduleRef.get(COURSE_SERVICE);
    courseRepository = moduleRef.get(getRepositoryToken(Course));
  });

  describe('Create one user', () => {
    it('should create one user', async () => {
      const requestUser = new UserFactory().asAdmin().build();

      const dto = new CreateCourseDto();
      dto.name = 'My First Project';
      dto.price = 120.0;

      const createdUser = await courseService.createOne(requestUser, dto);

      expect(createdUser).toBeDefined();
      expect(createdUser.id).toBeTruthy();
    });

    it('should create one user', async () => {
      const requestUser = new UserFactory().asGuest().build();

      const dto = new CreateCourseDto();
      dto.name = 'My First Project';
      dto.price = 120.0;

      expect(async () =>
        courseService.createOne(requestUser, dto),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('Find one course', () => {
    it('should return a course given its id', async () => {
      let defaultCourse = new CourseFactory()
        .withName('My First Project')
        .withPrice(new Price(120))
        .build();

      delete defaultCourse.id;
      defaultCourse = await courseRepository.save(defaultCourse);

      const requestUser = new UserFactory().asUser().build();

      const course = await courseService.findOne(requestUser, defaultCourse.id);
      expect(course).toBeDefined();
    });

    it('should throw a Not Found Exception if the course does not exist', async () => {
      const requestUser = new UserFactory().asAdmin().build();

      expect(async () =>
        courseService.findOne(requestUser, v4()),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('Updates one course', () => {
    it('should update one course', async () => {
      let defaultCourse = new CourseFactory()
        .withName('NestJS complete course 2022')
        .withPrice(new Price(120))
        .build();

      delete defaultCourse.id;
      defaultCourse = await courseRepository.save(defaultCourse);

      const dto = new UpdateCourseDto();
      dto.price = 50.0;
      dto.name = 'NestJS complete course 2023';

      const requestUser = new UserFactory().asAdmin().build();

      const course = await courseService.updateOne(
        requestUser,
        defaultCourse.id,
        dto,
      );
      expect(course).toBeDefined();
    });

    it('should throw a Not Found Exception if the user does not exist', async () => {
      const dto = new UpdateCourseDto();
      dto.price = 50.0;
      dto.name = 'NestJS complete course 2023';

      const requestUser = new UserFactory().asAdmin().build();

      expect(async () =>
        courseService.updateOne(requestUser, v4(), dto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('Deletes one course', () => {
    it('should delete one course', async () => {
      let defaultCourse = new CourseFactory()
        .withName('NestJS complete course 2022')
        .withPrice(new Price(120))
        .build();

      delete defaultCourse.id;
      defaultCourse = await courseRepository.save(defaultCourse);

      const requestUser = new UserFactory().asAdmin().build();

      const course = await courseService.deleteOne(
        requestUser,
        defaultCourse.id,
      );

      expect(course).toBeDefined();
      expect(course).toHaveProperty('id', undefined);
    });

    it('should throw a Not Found Exception if the course does not exist', async () => {
      const requestUser = new UserFactory().asAdmin().build();

      expect(() => courseService.deleteOne(requestUser, v4())).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});

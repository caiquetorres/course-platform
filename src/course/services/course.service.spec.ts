import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Course } from '../entities/course.entity';

import { CreateCourseDto } from '../dtos/create-course.dto';
import { UpdateCourseDto } from '../dtos/update-course.dto';

import { CourseService } from './course.service';

import { UserFactory } from '../../user/factories/user.factory';
import { TestBed } from '@automock/jest';
import { v4 } from 'uuid';

describe('CourseService (unit)', () => {
  let courseService: CourseService;
  let courseRepository: Repository<Course>;

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(CourseService).compile();

    courseService = unit;
    courseRepository = unitRef.get(getRepositoryToken(Course) as string);
  });

  describe('Create one course', () => {
    it('should create one course', async () => {
      jest.spyOn(courseRepository, 'save').mockResolvedValueOnce({} as any);

      // admin user
      const requestUser = new UserFactory().asAdmin().build();

      const dto = new CreateCourseDto();
      dto.name = 'My First Project';
      dto.price = 120.0;

      const createdCourse = await courseService.createOne(requestUser, dto);
      expect(createdCourse).toBeDefined();
    });

    it('should throw a Forbidden Exception when a not permitted user is trying to create a course', () => {
      jest.spyOn(courseRepository, 'save').mockResolvedValueOnce({} as any);

      let requestUser = new UserFactory().asUser().build();

      let dto = new CreateCourseDto();
      dto.name = 'Jane Doe';
      dto.price = 120.0;

      expect(async () =>
        courseService.createOne(requestUser, dto),
      ).rejects.toThrow(ForbiddenException);

      jest.spyOn(courseRepository, 'save').mockResolvedValueOnce({} as any);

      requestUser = new UserFactory().asGuest().build();

      dto = new CreateCourseDto();
      dto.name = 'Jane Doe';
      dto.price = 120.0;

      expect(async () =>
        courseService.createOne(requestUser, dto),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('Find one course', () => {
    it('should return a course given its id', async () => {
      let id = v4();
      let requestUser = new UserFactory().asGuest().build();

      jest
        .spyOn(courseRepository, 'findOneBy')
        .mockResolvedValueOnce({ id } as any);

      let course = await courseService.findOne(requestUser, id);
      expect(course).toBeDefined();

      id = v4();
      requestUser = new UserFactory().asUser().build();

      jest
        .spyOn(courseRepository, 'findOneBy')
        .mockResolvedValueOnce({ id } as any);

      course = await courseService.findOne(requestUser, id);
      expect(course).toBeDefined();
    });

    it('should throw a Not Found Exception if the user does not exist', () => {
      const id = v4();
      const requestUser = new UserFactory().asGuest().build();

      jest.spyOn(courseRepository, 'findOneBy').mockResolvedValueOnce(null);

      expect(async () =>
        courseService.findOne(requestUser, id),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('Updates one course', () => {
    it('should update one course', async () => {
      const id = v4();

      jest.spyOn(courseRepository, 'save').mockResolvedValueOnce({} as any);
      jest.spyOn(courseRepository, 'findOne').mockResolvedValueOnce({} as any);

      const requestUser = new UserFactory().asAdmin().build();

      const dto = new UpdateCourseDto();
      dto.name = 'My Second Project';

      const updatedCourse = await courseService.updateOne(requestUser, id, dto);
      expect(updatedCourse).toBeDefined();
    });

    it('should throw a Not Found Exception if the user does not exist', async () => {
      const id = v4();

      jest.spyOn(courseRepository, 'findOne').mockResolvedValueOnce(null);

      const requestUser = new UserFactory().asAdmin().build();

      const dto = new UpdateCourseDto();
      dto.name = 'My Second Project';

      expect(() =>
        courseService.updateOne(requestUser, id, dto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw a Forbidden Exception if the request user has no permissions', () => {
      const id = v4();
      const requestUser = new UserFactory().asUser().build();

      const dto = new UpdateCourseDto();
      dto.name = 'My Second Project';

      expect(async () =>
        courseService.updateOne(requestUser, id, dto),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('Deletes one course', () => {
    it('should update one course', async () => {
      const id = v4();

      jest.spyOn(courseRepository, 'remove').mockResolvedValueOnce({} as any);
      jest
        .spyOn(courseRepository, 'findOneBy')
        .mockResolvedValueOnce({} as any);

      const requestUser = new UserFactory().asAdmin().build();

      const deleteCourse = await courseService.deleteOne(requestUser, id);
      expect(deleteCourse).toBeDefined();
    });

    it('should throw a Not Found Exception if the course does not exist', async () => {
      const id = v4();

      jest.spyOn(courseRepository, 'findOne').mockResolvedValueOnce(null);

      const requestUser = new UserFactory().asAdmin().build();

      expect(async () =>
        courseService.deleteOne(requestUser, id),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw a Forbidden Exception if the request user has no permissions', () => {
      let id = v4();
      let requestUser = new UserFactory().asUser().build();

      jest
        .spyOn(courseRepository, 'findOneBy')
        .mockResolvedValueOnce({} as any);

      expect(async () =>
        courseService.deleteOne(requestUser, id),
      ).rejects.toThrow(ForbiddenException);

      id = v4();
      requestUser = new UserFactory().asGuest().build();

      jest
        .spyOn(courseRepository, 'findOneBy')
        .mockResolvedValueOnce({} as any);

      expect(async () =>
        courseService.deleteOne(requestUser, id),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});

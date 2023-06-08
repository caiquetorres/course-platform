import {
  ConflictException,
  ForbiddenException,
  ImATeapotException,
  NotFoundException,
  Type,
} from '@nestjs/common';

import { Enrollment } from '../domain/models/enrollment';

import { UserBuilder } from '../../user/domain/builders/user.builder';
import { CourseBuilder } from '../domain/builders/course.builder';
import { CourseRepository } from '../infrastructure/repositories/course.repository';
import { EnrollmentRepository } from '../infrastructure/repositories/enrollment.repository';
import { EnrollInCourseUseCase } from './enroll-in-course.usecase';
import { TestBed } from '@automock/jest';
import { v4 } from 'uuid';

describe('EnrollInCourseUseCase (unit)', () => {
  let useCase: EnrollInCourseUseCase;
  let enrollmentRepository: EnrollmentRepository;
  let courseRepository: CourseRepository;

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(EnrollInCourseUseCase).compile();

    useCase = unit;

    courseRepository = unitRef.get(CourseRepository as Type);
    enrollmentRepository = unitRef.get(EnrollmentRepository as Type);
  });

  it('should enroll into a course', async () => {
    const requestUser = new UserBuilder().withRandomId().asUser().build();

    const targetCourse = new CourseBuilder()
      .withRandomId()
      .withOwner(new UserBuilder().withRandomId().build())
      .build();

    jest
      .spyOn(enrollmentRepository, 'findByOwnerAndCourse')
      .mockResolvedValueOnce(null);

    jest
      .spyOn(courseRepository, 'findOneById')
      .mockResolvedValueOnce(targetCourse);

    jest
      .spyOn(enrollmentRepository, 'save')
      .mockResolvedValueOnce({} as Enrollment);

    const result = await useCase.enroll(requestUser, targetCourse.id);

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toBeDefined();
  });

  it('it should throw a Forbidden Exception if the user is a guest', async () => {
    const requestUser = new UserBuilder().withRandomId().asGuest().build();

    const targetCourse = new CourseBuilder()
      .withRandomId()
      .withOwner(new UserBuilder().withRandomId().build())
      .build();

    const result = await useCase.enroll(requestUser, targetCourse.id);

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ForbiddenException);
  });

  it('should throw a Not Found Exception if the course was not found', async () => {
    const requestUser = new UserBuilder().withRandomId().asUser().build();

    jest
      .spyOn(enrollmentRepository, 'findByOwnerAndCourse')
      .mockResolvedValueOnce(null);

    jest.spyOn(courseRepository, 'findOneById').mockResolvedValueOnce(null);

    jest
      .spyOn(enrollmentRepository, 'save')
      .mockResolvedValueOnce({} as Enrollment);

    const result = await useCase.enroll(requestUser, v4());

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotFoundException);
  });

  it("should throw I'm a Teapot Exception if the course owner is trying to enroll in his own course", async () => {
    const requestUser = new UserBuilder().withRandomId().asUser().build();

    const targetCourse = new CourseBuilder()
      .withRandomId()
      .withOwner(requestUser)
      .build();

    jest
      .spyOn(enrollmentRepository, 'findByOwnerAndCourse')
      .mockResolvedValueOnce(null);

    jest
      .spyOn(courseRepository, 'findOneById')
      .mockResolvedValueOnce(targetCourse);

    jest
      .spyOn(enrollmentRepository, 'save')
      .mockResolvedValueOnce({} as Enrollment);

    const result = await useCase.enroll(requestUser, targetCourse.id);

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ImATeapotException);
  });

  it('should throw a Conflict Exception if the user is already registered into the course', async () => {
    const requestUser = new UserBuilder().withRandomId().asUser().build();

    const targetCourse = new CourseBuilder()
      .withRandomId()
      .withOwner(new UserBuilder().withRandomId().build())
      .build();

    jest
      .spyOn(enrollmentRepository, 'findByOwnerAndCourse')
      .mockResolvedValueOnce({} as Enrollment);

    jest
      .spyOn(courseRepository, 'findOneById')
      .mockResolvedValueOnce(targetCourse);

    jest
      .spyOn(enrollmentRepository, 'save')
      .mockResolvedValueOnce({} as Enrollment);

    const result = await useCase.enroll(requestUser, targetCourse.id);

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ConflictException);
  });
});

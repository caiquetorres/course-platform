import { ForbiddenException, NotFoundException, Type } from '@nestjs/common';

import { Enrollment } from '../../../src/course/domain/models/enrollment';

import { CourseRepository } from '../../../src/course/infrastructure/repositories/course.repository';
import { EnrollmentRepository } from '../../../src/course/infrastructure/repositories/enrollment.repository';
import { QuitFromCourseUseCase } from '../../../src/course/usecases/quit-from-course.usecase';
import { CourseBuilder } from '../../builders/course/course.builder';
import { UserBuilder } from '../../builders/user/user.builder';
import { TestBed } from '@automock/jest';
import { v4 } from 'uuid';

describe('QuitFromCourseUseCase (unit)', () => {
  let useCase: QuitFromCourseUseCase;
  let enrollmentRepository: EnrollmentRepository;
  let courseRepository: CourseRepository;

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(QuitFromCourseUseCase).compile();

    useCase = unit;

    courseRepository = unitRef.get(CourseRepository as Type);
    enrollmentRepository = unitRef.get(EnrollmentRepository as Type);
  });

  it('should quit from a course', async () => {
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

    jest.spyOn(enrollmentRepository, 'remove').mockResolvedValueOnce(void 0);

    const result = await useCase.quit(requestUser, targetCourse.id);

    expect(result.isRight()).toBeTruthy();
  });

  it('it should throw a Forbidden Exception if the user is a guest', async () => {
    const requestUser = new UserBuilder().withRandomId().asGuest().build();

    const result = await useCase.quit(requestUser, v4());

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ForbiddenException);
  });

  it('should throw a Not Found Exception if the course was not found', async () => {
    const requestUser = new UserBuilder().withRandomId().asUser().build();

    jest.spyOn(courseRepository, 'findOneById').mockResolvedValueOnce(null);

    const result = await useCase.quit(requestUser, v4());

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotFoundException);
  });

  it('should throw a Not Found Exception if the course was not found', async () => {
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

    const result = await useCase.quit(requestUser, targetCourse.id);

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotFoundException);
  });
});

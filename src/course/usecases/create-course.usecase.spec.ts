import { ForbiddenException, Type } from '@nestjs/common';

import { Course } from '../domain/models/course';
import { CreateCourseDto } from '../presentation/create-course.dto';

import { UserBuilder } from '../../user/domain/builders/user.builder';
import { CourseBuilder } from '../domain/builders/course.builder';
import { CourseRepository } from '../infrastructure/repositories/course.repository';
import { CreateCourseUseCase } from './create-course.usecase';
import { TestBed } from '@automock/jest';

describe('CreateCourseUseCase (unit)', () => {
  let useCase: CreateCourseUseCase;
  let repository: CourseRepository;

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(CreateCourseUseCase).compile();

    useCase = unit;
    repository = unitRef.get(CourseRepository as Type);
  });

  it('should create one user', async () => {
    const requestUser = new UserBuilder()
      .withRandomId()
      .withName('Jane Doe')
      .asAuthor()
      .build();

    const targetCourse = new CourseBuilder()
      .withRandomId()
      .withOwner(requestUser)
      .build();

    jest.spyOn(repository, 'save').mockResolvedValueOnce(targetCourse);

    const dto = new CreateCourseDto();
    dto.name = 'Software Engineering';
    dto.price = 120;

    const result = await useCase.create(requestUser, dto);
    expect(result.isRight()).toBeTruthy();
    expect(result.value).toHaveProperty('name', targetCourse.name);
    expect((result.value as Course).owner).toHaveProperty('name', 'Jane Doe');
  });

  it('should throw a Forbidden Exception if the user is not an admin', async () => {
    const requestUser = new UserBuilder().withRandomId().asUser().build();
    const targetCourse = new CourseBuilder()
      .withRandomId()
      .withOwner(requestUser)
      .build();

    jest.spyOn(repository, 'save').mockResolvedValueOnce(targetCourse);

    const dto = new CreateCourseDto();
    dto.name = 'Software Engineering';
    dto.price = 120;

    const result = await useCase.create(requestUser, dto);
    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ForbiddenException);
  });
});

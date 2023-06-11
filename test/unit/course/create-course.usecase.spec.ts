import { ForbiddenException, Type } from '@nestjs/common';

import { Course } from '../../../src/course/domain/models/course';
import { CreateCourseDto } from '../../../src/course/presentation/create-course.dto';

import { CourseBuilder } from '../../builders/course/course.builder';
import { CourseRepository } from '../../../src/course/infrastructure/repositories/course.repository';
import { CreateCourseUseCase } from '../../../src/course/usecases/create-course.usecase';
import { UserBuilder } from '../../builders/user/user.builder';
import { TestBed } from '@automock/jest';

describe('CreateCourseUseCase (unit)', () => {
  let useCase: CreateCourseUseCase;
  let repository: CourseRepository;

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(CreateCourseUseCase).compile();

    useCase = unit;
    repository = unitRef.get(CourseRepository as Type);
  });

  it('should create one course', async () => {
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

  it('should throw a Forbidden Exception if the user is not an admin or an author', async () => {
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

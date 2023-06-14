import { ForbiddenException, NotFoundException, Type } from '@nestjs/common';

import { Course } from '../../../src/course/domain/models/course';
import { UpdateCourseDto } from '../../../src/course/presentation/update-course.dto';

import { CourseRepository } from '../../../src/course/infrastructure/repositories/course.repository';
import { UpdateCourseUseCase } from '../../../src/course/usecases/update-course.usecase';
import { CourseBuilder } from '../../builders/course/course.builder';
import { UserBuilder } from '../../builders/user/user.builder';
import { TestBed } from '@automock/jest';
import { v4 } from 'uuid';

describe('UpdateCourseUseCase (unit)', () => {
  let useCase: UpdateCourseUseCase;
  let repository: CourseRepository;

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(UpdateCourseUseCase).compile();

    useCase = unit;
    repository = unitRef.get(CourseRepository as Type);
  });

  it('should update a course', async () => {
    const requestUser = new UserBuilder()
      .withRandomId()
      .withName('Jane Doe')
      .asAuthor()
      .build();

    const targetCourse = new CourseBuilder()
      .withRandomId()
      .withOwner(requestUser)
      .build();

    jest.spyOn(repository, 'findOneById').mockResolvedValueOnce(targetCourse);
    jest.spyOn(repository, 'save').mockResolvedValueOnce(targetCourse);

    const dto = new UpdateCourseDto();
    dto.name = 'Software Engineering';
    dto.price = 120;

    const result = await useCase.update(requestUser, targetCourse.id, dto);
    expect(result.isRight()).toBeTruthy();
    expect(result.value).toHaveProperty('name', targetCourse.name);
    expect((result.value as Course).owner).toHaveProperty('name', 'Jane Doe');
  });

  it('should throw a Not Found Exception if the course does not exist', async () => {
    const requestUser = new UserBuilder().withRandomId().asAuthor().build();

    jest.spyOn(repository, 'findOneById').mockResolvedValueOnce(null);

    const dto = new UpdateCourseDto();
    dto.name = 'Software Engineering';
    dto.price = 120;

    const result = await useCase.update(requestUser, v4(), dto);
    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotFoundException);
  });

  it('should throw a Forbidden Exception if the user is not the course owner', async () => {
    const requestUser = new UserBuilder().withRandomId().asAuthor().build();
    const owner = new UserBuilder().withRandomId().asAuthor().build();

    const targetCourse = new CourseBuilder()
      .withRandomId()
      .withOwner(owner)
      .build();

    jest.spyOn(repository, 'findOneById').mockResolvedValueOnce(targetCourse);
    jest.spyOn(repository, 'save').mockResolvedValueOnce(targetCourse);

    const dto = new UpdateCourseDto();
    dto.name = 'Software Engineering';
    dto.price = 120;

    const result = await useCase.update(requestUser, targetCourse.id, dto);
    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ForbiddenException);
  });
});

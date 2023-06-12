import { ForbiddenException, Type } from '@nestjs/common';

import { Course } from '../../../src/course/domain/models/course';

import { IPage } from '../../../src/common/domain/interfaces/page.interface';
import { CourseRepository } from '../../../src/course/infrastructure/repositories/course.repository';
import { FindOwnedCoursesUseCase } from '../../../src/user/usecases/find-owned-courses.usecase';
import { UserBuilder } from '../../builders/user/user.builder';
import { TestBed } from '@automock/jest';

describe('FindOwnedCoursesUseCase (unit)', () => {
  let useCase: FindOwnedCoursesUseCase;
  let repository: CourseRepository;

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(FindOwnedCoursesUseCase).compile();

    useCase = unit;
    repository = unitRef.get(CourseRepository as Type);
  });

  it('should get the request user owned courses', async () => {
    jest
      .spyOn(repository, 'findManyByAuthorId')
      .mockResolvedValueOnce({ data: [{}, {}, {}] } as IPage<Course>);

    const requestUser = new UserBuilder().withRandomId().asAuthor().build();

    const result = await useCase.find(requestUser, {
      afterCursor: null,
      beforeCursor: null,
      limit: 10,
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toBeDefined();
  });

  it('should throw Forbidden Exception when the request user is not an admin', async () => {
    jest
      .spyOn(repository, 'findManyByAuthorId')
      .mockResolvedValueOnce({ data: [{}, {}, {}] } as IPage<Course>);

    const requestUser = new UserBuilder().withRandomId().asUser().build();

    const result = await useCase.find(requestUser, {
      afterCursor: null,
      beforeCursor: null,
      limit: 10,
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ForbiddenException);
  });
});

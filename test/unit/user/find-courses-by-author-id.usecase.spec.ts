import { Type } from '@nestjs/common';

import { Course } from '../../../src/course/domain/models/course';

import { IPage } from '../../../src/common/domain/interfaces/page.interface';
import { CourseRepository } from '../../../src/course/infrastructure/repositories/course.repository';
import { FindCoursesByAuthorIdUseCase } from '../../../src/user/usecases/find-courses-by-author-id.usecase';
import { UserBuilder } from '../../builders/user/user.builder';
import { TestBed } from '@automock/jest';
import { v4 } from 'uuid';

describe('FindCoursesByAuthorIdUseCase (unit)', () => {
  let useCase: FindCoursesByAuthorIdUseCase;
  let repository: CourseRepository;

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(
      FindCoursesByAuthorIdUseCase,
    ).compile();

    useCase = unit;
    repository = unitRef.get(CourseRepository as Type);
  });

  it("should get the courses given the author's name", async () => {
    jest
      .spyOn(repository, 'findManyByAuthorId')
      .mockResolvedValueOnce({ data: [{}, {}, {}] } as IPage<Course>);

    const requestUser = new UserBuilder().withRandomId().asGuest().build();

    const result = await useCase.find(requestUser, v4(), {
      afterCursor: null,
      beforeCursor: null,
      limit: 10,
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toBeDefined();
  });
});

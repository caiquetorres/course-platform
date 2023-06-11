import { Type } from '@nestjs/common';

import { Course } from '../../../src/course/domain/models/course';

import { IPage } from '../../../src/common/domain/interfaces/page.interface';
import { CourseRepository } from '../../../src/course/infrastructure/repositories/course.repository';
import { FindManyCoursesUseCase } from '../../../src/course/usecases/find-many-courses.usecase';
import { UserBuilder } from '../../builders/user/user.builder';
import { TestBed } from '@automock/jest';

describe('FindManyCoursesUseCase (unit)', () => {
  let useCase: FindManyCoursesUseCase;
  let repository: CourseRepository;

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(FindManyCoursesUseCase).compile();

    useCase = unit;
    repository = unitRef.get(CourseRepository as Type);
  });

  it('should find several course', async () => {
    jest
      .spyOn(repository, 'findMany')
      .mockResolvedValueOnce({ data: [{}, {}, {}] } as IPage<Course>);

    const requestUser = new UserBuilder().withRandomId().asAdmin().build();

    const result = await useCase.findMany(requestUser, {
      afterCursor: null,
      beforeCursor: null,
      limit: 10,
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toHaveProperty('data');
  });
});

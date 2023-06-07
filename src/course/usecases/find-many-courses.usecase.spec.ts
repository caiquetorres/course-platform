import { Type } from '@nestjs/common';

import { Course } from '../domain/models/course';

import { IPage } from '../../common/domain/interfaces/page.interface';
import { UserBuilder } from '../../user/domain/builders/user.builder';
import { CourseRepository } from '../infrastructure/repositories/course.repository';
import { FindManyCoursesUseCase } from './find-many-courses.usecase';
import { TestBed } from '@automock/jest';

describe('FindManyCoursesUseCase (unit)', () => {
  let useCase: FindManyCoursesUseCase;
  let repository: CourseRepository;

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(FindManyCoursesUseCase).compile();

    useCase = unit;
    repository = unitRef.get(CourseRepository as Type);
  });

  it('should find one course', async () => {
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

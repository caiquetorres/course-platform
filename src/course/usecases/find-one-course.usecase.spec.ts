import { NotFoundException, Type } from '@nestjs/common';

import { UserBuilder } from '../../user/domain/builders/user.builder';
import { CourseBuilder } from '../domain/builders/course.builder';
import { CourseRepository } from '../infrastructure/repositories/course.repository';
import { FindOneCourseUseCase } from './find-one-course.usecase';
import { TestBed } from '@automock/jest';
import { v4 } from 'uuid';

describe('FindOneCourseUseCase (unit)', () => {
  let useCase: FindOneCourseUseCase;
  let repository: CourseRepository;

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(FindOneCourseUseCase).compile();

    useCase = unit;
    repository = unitRef.get(CourseRepository as Type);
  });

  it('should find one course', async () => {
    const owner = new UserBuilder().withRandomId().build();
    const targetCourse = new CourseBuilder()
      .withRandomId()
      .withOwner(owner)
      .build();
    const requestUser = new UserBuilder().withRandomId().asAdmin().build();

    jest.spyOn(repository, 'findOneById').mockResolvedValueOnce(targetCourse);

    const result = await useCase.findOne(requestUser, targetCourse.id);
    expect(result.isRight()).toBeTruthy();
    expect(result.value).toHaveProperty('name', targetCourse.name);
  });

  it('should throw a Not Found Exception if the course does not exist', async () => {
    const requestUser = new UserBuilder().withRandomId().asUser().build();

    jest.spyOn(repository, 'findOneById').mockResolvedValueOnce(null);

    const result = await useCase.findOne(requestUser, v4());
    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotFoundException);
  });
});

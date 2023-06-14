import { ForbiddenException, NotFoundException, Type } from '@nestjs/common';

import { CourseRepository } from '../../../src/course/infrastructure/repositories/course.repository';
import { DeleteCourseUseCase } from '../../../src/course/usecases/delete-course.usecase';
import { UserBuilder } from '../../../test/builders/user/user.builder';
import { CourseBuilder } from '../../builders/course/course.builder';
import { TestBed } from '@automock/jest';
import { v4 } from 'uuid';

describe('DeleteCourseUseCase (unit)', () => {
  let useCase: DeleteCourseUseCase;
  let repository: CourseRepository;

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(DeleteCourseUseCase).compile();

    useCase = unit;
    repository = unitRef.get(CourseRepository as Type);
  });

  it('should delete a course', async () => {
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
    jest.spyOn(repository, 'removeOne').mockResolvedValueOnce(void 0);

    const result = await useCase.delete(requestUser, targetCourse.id);
    expect(result.isRight()).toBeTruthy();
  });

  it('should throw a Not Found Exception if the course does not exist', async () => {
    const requestUser = new UserBuilder().withRandomId().asAuthor().build();

    jest.spyOn(repository, 'findOneById').mockResolvedValueOnce(null);

    const result = await useCase.delete(requestUser, v4());
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
    jest.spyOn(repository, 'removeOne').mockResolvedValueOnce(void 0);

    const result = await useCase.delete(requestUser, targetCourse.id);
    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ForbiddenException);
  });
});

import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AllowFor } from '../../common/infrastructure/decorators/auth/allow-for.decorator';
import { Public } from '../../common/infrastructure/decorators/auth/public.decorator';
import { RequestUser } from '../../common/infrastructure/decorators/request-user/request-user.decorator';

import { Role } from '../domain/models/role.enum';
import { User } from '../domain/models/user';

import { PageQuery } from '../../common/presentation/page.query';
import { CoursePagePresenter } from '../../course/presentation/course-page.presenter';
import { CoursePresenter } from '../../course/presentation/course.presenter';
import { FindCoursesByAuthorIdUseCase } from '../usecases/find-courses-by-author-id.usecase';
import { FindOwnedCoursesUseCase } from '../usecases/find-owned-courses.usecase';

@ApiTags('users')
@Controller('users')
export class UserCourseController {
  constructor(
    private readonly _findOwnedCoursesUseCase: FindOwnedCoursesUseCase,
    private readonly _findCoursesByAuthorId: FindCoursesByAuthorIdUseCase,
  ) {}

  @Public()
  @Get('me/courses')
  findMyCourses(@RequestUser() requestUser: User, @Query() query: PageQuery) {}

  @Public()
  @Get(':id/courses')
  findCoursesById(
    @RequestUser() requestUser: User,
    @Query() query: PageQuery,
  ) {}

  @ApiOperation({
    summary: 'Retrieves several courses owned by the request user',
  })
  @ApiOkResponse({
    type: CoursePagePresenter,
    description: 'The list of courses',
  })
  @AllowFor(Role.author)
  @Get('me/courses/owned')
  async findOwned(@RequestUser() requestUser: User, @Query() query: PageQuery) {
    const result = await this._findOwnedCoursesUseCase.find(requestUser, query);

    if (result.isRight()) {
      return new CoursePagePresenter({
        cursor: result.value.cursor,
        data: result.value.data.map((course) => new CoursePresenter(course)),
      });
    }

    throw result.value;
  }

  @ApiOperation({
    summary: "Retrieves several courses given the author's id",
  })
  @ApiOkResponse({
    type: CoursePagePresenter,
    description: 'The list of courses',
  })
  @AllowFor(Role.author)
  @Get(':authorId/courses/owned')
  async findOwnedById(
    @RequestUser() requestUser: User,
    @Param('authorId', ParseUUIDPipe) authorId: string,
    @Query() query: PageQuery,
  ) {
    const result = await this._findCoursesByAuthorId.find(
      requestUser,
      authorId,
      query,
    );

    if (result.isRight()) {
      return new CoursePagePresenter({
        cursor: result.value.cursor,
        data: result.value.data.map((course) => new CoursePresenter(course)),
      });
    }

    throw result.value;
  }
}

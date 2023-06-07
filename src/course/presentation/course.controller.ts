import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { AllowFor } from '../../common/infrastructure/decorators/auth/allow-for.decorator';
import { Public } from '../../common/infrastructure/decorators/auth/public.decorator';
import { RequestUser } from '../../common/infrastructure/decorators/request-user/request-user.decorator';

import { Role } from '../../user/domain/models/role.enum';
import { User } from '../../user/domain/models/user';
import { CreateCourseDto } from './create-course.dto';

import { PageQuery } from '../../common/presentation/page.query';
import { CreateCourseUseCase } from '../usecases/create-course.usecase';
import { FindManyCoursesUseCase } from '../usecases/find-many-courses.usecase';
import { FindOneCourseUseCase } from '../usecases/find-one-course.usecase';
import { CoursePagePresenter } from './course-page.presenter';
import { CoursePresenter } from './course.presenter';

@ApiTags('courses')
@Controller('courses')
export class CourseController {
  constructor(
    private readonly _createCourseUseCase: CreateCourseUseCase,
    private readonly _findOneCourseUseCase: FindOneCourseUseCase,
    private readonly _findManyCoursesUseCase: FindManyCoursesUseCase,
  ) {}

  /**
   * Creates a new course with the given data.
   *
   * @param requestUser The user who is creating the user.
   * @param dto The data for the new course.
   * @returns A Promise that resolves to the created user.
   */
  @ApiOperation({ summary: 'Creates a new course' })
  @ApiCreatedResponse({
    type: CoursePresenter,
    description: 'The course was successfully created',
  })
  @AllowFor(Role.author)
  @Post()
  async createOne(
    @RequestUser() requestUser: User,
    @Body() dto: CreateCourseDto,
  ) {
    const result = await this._createCourseUseCase.create(requestUser, dto);

    if (result.isRight()) {
      return new CoursePresenter(result.value);
    }

    throw result.value;
  }

  @ApiOperation({ summary: 'Retrieves a course given it id' })
  @ApiOkResponse({
    type: CoursePresenter,
    description: 'The course was found',
  })
  @Public()
  @Get(':id')
  async findOne(
    @RequestUser() requestUser: User,
    @Param('id', ParseUUIDPipe) courseId: string,
  ) {
    const result = await this._findOneCourseUseCase.findOne(
      requestUser,
      courseId,
    );

    if (result.isRight()) {
      return new CoursePresenter(result.value);
    }

    throw result.value;
  }

  @ApiOperation({ summary: 'Retrieves several courses' })
  @ApiOkResponse({
    type: CoursePagePresenter,
    description: 'The list of courses',
  })
  @Public()
  @Get()
  async findMany(@RequestUser() requestUser: User, @Query() query: PageQuery) {
    const result = await this._findManyCoursesUseCase.findMany(
      requestUser,
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

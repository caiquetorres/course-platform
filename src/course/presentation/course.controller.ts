import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AllowFor } from '../../common/infrastructure/decorators/auth/allow-for.decorator';
import { RequestUser } from '../../common/infrastructure/decorators/request-user/request-user.decorator';

import { Role } from '../../user/domain/models/role.enum';
import { User } from '../../user/domain/models/user';
import { CreateCourseDto } from './create-course.dto';

import { CreateCourseUseCase } from '../usecases/create-course.usecase';
import { CoursePresenter } from './course.presenter';

@ApiTags('courses')
@Controller('courses')
export class CourseController {
  constructor(private readonly _createCourseUseCase: CreateCourseUseCase) {}

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
  @AllowFor(Role.admin)
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
}

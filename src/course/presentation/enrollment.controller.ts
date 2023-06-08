import { Controller, Put, Delete, Param, ParseUUIDPipe } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiNoContentResponse,
} from '@nestjs/swagger';

import { AllowFor } from '../../common/infrastructure/decorators/auth/allow-for.decorator';
import { RequestUser } from '../../common/infrastructure/decorators/request-user/request-user.decorator';

import { Role } from '../../user/domain/models/role.enum';
import { User } from '../../user/domain/models/user';

import { EnrollInCourseUseCase } from '../usecases/enroll-in-course.usecase';
import { QuitTheCourseUseCase } from '../usecases/quit-the-course.usecase';
import { EnrollmentPresenter } from './enrollment.presenter';

@ApiTags('courses')
@Controller('courses/:courseId')
export class EnrollmentController {
  constructor(
    private readonly _enrollInCourseUseCase: EnrollInCourseUseCase,
    private readonly _quitTheCourseUseCase: QuitTheCourseUseCase,
  ) {}

  @ApiOperation({ summary: 'Enrolls a user into a course' })
  @ApiCreatedResponse({
    type: EnrollmentPresenter,
    description: 'The enrollment was successfully created',
  })
  @AllowFor(Role.user)
  @Put('enroll')
  async enroll(
    @RequestUser() requestUser: User,
    @Param('courseId', ParseUUIDPipe) courseId: string,
  ) {
    const result = await this._enrollInCourseUseCase.enroll(
      requestUser,
      courseId,
    );

    if (result.isRight()) {
      return new EnrollmentPresenter(result.value);
    }

    throw result.value;
  }

  @ApiOperation({ summary: 'Withdraws a user into a course' })
  @ApiNoContentResponse({
    description: 'The enrollment was successfully deleted',
  })
  @Delete('quit')
  async quit(
    @RequestUser() requestUser: User,
    @Param('courseId', ParseUUIDPipe) courseId: string,
  ) {
    const result = await this._quitTheCourseUseCase.quit(requestUser, courseId);

    if (result.isLeft()) {
      throw result.value;
    }
  }
}

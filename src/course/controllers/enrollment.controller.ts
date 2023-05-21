import { Controller, Delete, Put } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { ApiForbidden } from '../../common/decorators/api/api-forbidden.decorator';
import { ApiNotFound } from '../../common/decorators/api/api-not-found.decorator';
import { ApiUnauthorized } from '../../common/decorators/api/api-unauthorized.decorator';
import { AllowFor } from '../../common/decorators/auth/allow-for.decorator';
import { InjectEnrollmentService } from '../decorators/inject-service.decorator';

import { User } from '../../user/entities/user.entity';
import { Course } from '../entities/course.entity';
import { Enrollment } from '../entities/enrollment.entity';

import { Role } from '../../user/enums/role.enum';

import { IEnrollmentService } from '../interfaces/enrollment.service.interface';

@ApiTags('courses')
@Controller('courses/:courseId')
export class EnrollmentController {
  constructor(
    @InjectEnrollmentService()
    private readonly _enrollmentService: IEnrollmentService,
  ) {}

  @ApiOperation({ summary: 'Enrolls a user into a course' })
  @ApiCreatedResponse({
    type: Enrollment,
    description: 'The enrollment was successfully created',
  })
  @ApiUnauthorized()
  @ApiForbidden()
  @ApiNotFound(Course)
  @AllowFor(Role.user)
  @Put('enroll')
  enroll(requestUser: User, courseId: string) {
    return this._enrollmentService.enroll(requestUser, courseId);
  }

  @ApiOperation({ summary: 'Withdraws a user into a course' })
  @ApiOkResponse({
    type: Enrollment,
    description: 'The enrollment was successfully deleted',
  })
  @ApiUnauthorized()
  @ApiForbidden()
  @ApiNotFound(Course)
  @AllowFor(Role.user)
  @Delete('withdraw')
  withdraw(requestUser: User, courseId: string) {
    return this._enrollmentService.withdraw(requestUser, courseId);
  }
}

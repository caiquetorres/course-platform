import { Controller, Delete, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { ApiForbidden } from '../../common/decorators/api/api-forbidden.decorator';
import { ApiNotFound } from '../../common/decorators/api/api-not-found.decorator';
import { ApiUnauthorized } from '../../common/decorators/api/api-unauthorized.decorator';
import { AllowFor } from '../../common/decorators/auth/allow-for.decorator';
import { InjectEnrollmentService } from '../decorators/inject-service.decorator';

import { User } from '../../user/entities/user.entity';
import { Course } from '../entities/course.entity';

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
  @ApiUnauthorized()
  @ApiForbidden()
  @ApiNotFound(Course)
  @AllowFor(Role.user)
  @Put()
  enroll(requestUser: User, courseId: string) {
    return this._enrollmentService.enroll(requestUser, courseId);
  }

  @ApiUnauthorized()
  @ApiForbidden()
  @ApiNotFound(Course)
  @AllowFor(Role.user)
  @Delete()
  withdraw(requestUser: User, courseId: string) {
    return this._enrollmentService.withdraw(requestUser, courseId);
  }
}

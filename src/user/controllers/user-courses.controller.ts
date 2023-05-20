import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ApiForbidden } from '../../common/decorators/api/api-forbidden.decorator';
import { ApiUnauthorized } from '../../common/decorators/api/api-unauthorized.decorator';
import { AllowFor } from '../../common/decorators/auth/allow-for.decorator';
import { RequestUser } from '../../common/decorators/request-user/request-user.decorator';
import { InjectUserCoursesService } from '../decorators/inject-service.decorator';

import { ParseUUIDPipe } from '../../common/pipes/parse-uuid/parse-uuid.pipe';

import { User } from '../entities/user.entity';

import { CoursePageDto } from '../../course/dtos/user-page.dto';
import { Role } from '../enums/role.enum';

import { PageQuery } from '../../common/classes/page.query';
import { IUserCoursesService } from '../interfaces/user-courses.interface';

@ApiTags('users')
@Controller('users/:id/courses')
export class UserCoursesController {
  constructor(
    @InjectUserCoursesService()
    private readonly _userCoursesService: IUserCoursesService,
  ) {}

  @ApiOperation({ summary: 'Retrieves several courses' })
  @ApiOkResponse({
    type: CoursePageDto,
    description: 'The list of courses',
  })
  @ApiUnauthorized()
  @ApiForbidden()
  @AllowFor(Role.user)
  @Get()
  findMany(
    @RequestUser() requestUser: User,
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: PageQuery,
  ) {
    return this._userCoursesService.findMany(requestUser, id, query);
  }
}

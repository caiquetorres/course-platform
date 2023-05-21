import { Controller, Delete, Param, Put } from '@nestjs/common';
import { ApiNoContentResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ApiForbidden } from '../../common/decorators/api/api-forbidden.decorator';
import { ApiNotFound } from '../../common/decorators/api/api-not-found.decorator';
import { ApiUnauthorized } from '../../common/decorators/api/api-unauthorized.decorator';
import { AllowFor } from '../../common/decorators/auth/allow-for.decorator';
import { RequestUser } from '../../common/decorators/request-user/request-user.decorator';
import { InjectApplicationService } from '../decorators/inject-service.decorator';

import { ParseUUIDPipe } from '../../common/pipes/parse-uuid/parse-uuid.pipe';

import { User } from '../../user/entities/user.entity';
import { Project } from '../entities/project.entity';

import { Role } from '../../user/enums/role.enum';

import { IApplicationService } from '../interfaces/application.service.interface';

@ApiTags('projects')
@Controller('projects/:projectId')
export class ApplicationController {
  constructor(
    @InjectApplicationService()
    private readonly _applicationService: IApplicationService,
  ) {}

  @ApiOperation({ summary: 'Applies to a project' })
  @ApiNoContentResponse({
    description: 'The application was successfully created',
  })
  @ApiUnauthorized()
  @ApiForbidden()
  @ApiNotFound(Project)
  @AllowFor(Role.pro)
  @Put('apply')
  apply(
    @RequestUser() requestUser: User,
    @Param('projectId', ParseUUIDPipe) projectId: string,
  ) {
    return this._applicationService.apply(requestUser, projectId);
  }

  @ApiOperation({ summary: 'Withdraws from a project' })
  @ApiNoContentResponse({
    description: 'The application was successfully deleted',
  })
  @ApiUnauthorized()
  @ApiForbidden()
  @ApiNotFound(Project)
  @AllowFor(Role.pro)
  @Delete('withdraw')
  withdraw(
    @RequestUser() requestUser: User,
    @Param('projectId', ParseUUIDPipe) projectId: string,
  ) {
    return this._applicationService.withdraw(requestUser, projectId);
  }
}

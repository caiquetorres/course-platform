import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { ApiForbidden } from '../../common/decorators/api/api-forbidden.decorator';
import { ApiNotFound } from '../../common/decorators/api/api-not-found.decorator';
import { ApiUnauthorized } from '../../common/decorators/api/api-unauthorized.decorator';
import { AllowFor } from '../../common/decorators/auth/allow-for.decorator';
import { Public } from '../../common/decorators/auth/public.decorator';
import { RequestUser } from '../../common/decorators/request-user/request-user.decorator';
import { InjectProjectService } from '../decorators/inject-service.decorator';

import { User } from '../../user/entities/user.entity';
import { Project } from '../entities/project.entity';

import { Role } from '../../user/enums/role.enum';
import { CreateProjectDto } from '../dtos/create-project.dto';
import { ProjectPageDto } from '../dtos/project-page.dto';
import { UpdateProjectDto } from '../dtos/update-project.dto';

import { IProjectService } from '../interfaces/project.service.interface';

import { PageQuery } from '../../common/classes/page.query';

@ApiTags('projects')
@Controller('projects')
export class ProjectController {
  constructor(
    @InjectProjectService()
    private readonly _projectService: IProjectService,
  ) {}

  @ApiOperation({ summary: 'Creates a new project' })
  @ApiCreatedResponse({
    type: Project,
    description: 'The project was successfully created',
  })
  @ApiBadRequestResponse({
    description: 'The payload was sent with invalid or missing fields',
    schema: {
      example: {
        statusCode: 400,
        message: ['It is required to send the project name'],
        error: 'Bad Request',
      },
    },
  })
  @AllowFor(Role.pro)
  @Post()
  createOne(@RequestUser() requestUser: User, @Body() dto: CreateProjectDto) {
    return this._projectService.createOne(requestUser, dto);
  }

  @ApiOperation({ summary: 'Retrieves a project given it id' })
  @ApiOkResponse({
    type: Project,
    description: 'The project was found',
  })
  @ApiBadRequestResponse({
    description: 'The given id is not a uuid',
    schema: {
      example: {
        statusCode: 400,
        message: `The value '0' is not a valid UUID`,
        error: 'Bad Request',
      },
    },
  })
  @ApiUnauthorized()
  @ApiForbidden()
  @ApiNotFound(Project)
  @Public()
  @Get(':id')
  findOne(
    @RequestUser() requestUser: User,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this._projectService.findOne(requestUser, id);
  }

  @ApiOperation({ summary: 'Retrieves several projects' })
  @ApiOkResponse({
    type: ProjectPageDto,
    description: 'The list of projects',
  })
  @ApiUnauthorized()
  @ApiForbidden()
  @Public()
  @Get()
  findMany(@RequestUser() requestUser: User, @Query() query: PageQuery) {
    return this._projectService.findMany(requestUser, query);
  }

  @ApiOperation({ summary: 'Updates one project' })
  @ApiOkResponse({
    type: Project,
    description: 'The project was successfully updated',
  })
  @ApiBadRequestResponse({
    description: 'The payload was sent with invalid or missing fields',
    schema: {
      example: {
        statusCode: 400,
        message: [
          'It is required to send name with length greater than 2 characters',
        ],
        error: 'Bad Request',
      },
    },
  })
  @ApiUnauthorized()
  @ApiForbidden()
  @ApiNotFound(Project)
  @AllowFor(Role.pro)
  @Put(':id')
  updateOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProjectDto,
    @RequestUser() requestUser: User,
  ) {
    return this._projectService.updateOne(requestUser, id, dto);
  }

  @ApiOperation({ summary: 'Deletes one project' })
  @ApiOkResponse({
    type: Project,
    description: 'The project was successfully deleted',
  })
  @ApiUnauthorized()
  @ApiForbidden()
  @ApiNotFound(Project)
  @AllowFor(Role.pro)
  @Delete(':id')
  deleteOne(
    @Param('id', ParseUUIDPipe) id: string,
    @RequestUser() requestUser: User,
  ) {
    return this._projectService.deleteOne(requestUser, id);
  }
}

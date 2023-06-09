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
import { Project } from '../domain/models/project';
import { CreateProjectDto } from './create-project.dto';
import { UpdateProjectDto } from './update-project.dto';

import { PageQuery } from '../../common/presentation/page.query';
import { CreateProjectUseCase } from '../usecases/create-project.usecase';
import { DeleteProjectUseCase } from '../usecases/delete-project.usecase';
import { FindManyProjectsUseCase } from '../usecases/find-many-projects.usecase';
import { FindOneProjectUseCase } from '../usecases/find-one-project.usecase';
import { UpdateProjectUseCase } from '../usecases/update-project.usecase';
import { ProjectPresenter } from './project.presenter';
import { ProjectPagePresenter } from './user-page.presenter';

@ApiTags('projects')
@Controller('projects')
export class ProjectController {
  constructor(
    private readonly _createProjectUseCase: CreateProjectUseCase,
    private readonly _findProjectUseCase: FindOneProjectUseCase,
    private readonly _findManyProjectsUseCase: FindManyProjectsUseCase,
    private readonly _updateProjectUseCase: UpdateProjectUseCase,
    private readonly _deleteProjectUseCase: DeleteProjectUseCase,
  ) {}

  @ApiOperation({ summary: 'Creates a new project' })
  @ApiCreatedResponse({
    type: ProjectPresenter,
    description: 'The project was successfully created',
  })
  @AllowFor(Role.pro)
  @Post()
  async createOne(
    @RequestUser() requestUser: User,
    @Body() dto: CreateProjectDto,
  ) {
    const result = await this._createProjectUseCase.create(requestUser, dto);

    if (result.isRight()) {
      return new ProjectPresenter(result.value);
    }

    throw result.value;
  }

  @ApiOperation({ summary: 'Retrieves a project given it id' })
  @ApiOkResponse({
    type: ProjectPresenter,
    description: 'The project was found',
  })
  @Public()
  @Get(':id')
  async findOne(
    @RequestUser() requestUser: User,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    const result = await this._findProjectUseCase.find(requestUser, id);

    if (result.isRight()) {
      return new ProjectPresenter(result.value);
    }

    throw result.value;
  }

  @ApiOperation({ summary: 'Retrieves several projects' })
  @ApiOkResponse({
    type: ProjectPagePresenter,
    description: 'The list of projects',
  })
  @Public()
  @Get()
  async findMany(
    @RequestUser() requestUser: User,
    @Query() query: PageQuery,
  ): Promise<ProjectPagePresenter> {
    const result = await this._findManyProjectsUseCase.find(requestUser, query);

    if (result.isRight()) {
      return {
        cursor: result.value.cursor,
        data: result.value.data.map((project) => new ProjectPresenter(project)),
      };
    }

    throw result.value;
  }

  @ApiOperation({ summary: 'Updates one project' })
  @ApiOkResponse({
    type: ProjectPresenter,
    description: 'The project was successfully updated',
  })
  @AllowFor(Role.pro)
  @Put(':id')
  async updateOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProjectDto,
    @RequestUser() requestUser: User,
  ) {
    const result = await this._updateProjectUseCase.update(
      requestUser,
      id,
      dto,
    );

    if (result.isRight()) {
      return new ProjectPresenter(result.value);
    }

    throw result.value;
  }

  @ApiOperation({ summary: 'Deletes one project' })
  @ApiOkResponse({
    type: Project,
    description: 'The project was successfully deleted',
  })
  @AllowFor(Role.pro)
  @Delete(':id')
  async deleteOne(
    @Param('id', ParseUUIDPipe) id: string,
    @RequestUser() requestUser: User,
  ) {
    const result = await this._deleteProjectUseCase.delete(requestUser, id);

    if (result.isLeft()) {
      throw result.value;
    }
  }
}

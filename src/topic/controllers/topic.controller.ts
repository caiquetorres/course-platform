import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
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
import { InjectTopicService } from '../decorators/inject-service.decorator';

import { Project } from '../../project/entities/project.entity';
import { User } from '../../user/entities/user.entity';
import { Topic } from '../entities/topic.entity';

import { CreateTopicDto } from '../dtos/create-topic.dto';
import { TopicPageDto } from '../dtos/topic-page.dto';

import { ITopicService } from '../interfaces/topic.service.interface';

import { PageQuery } from '../../common/classes/page.query';

@ApiTags('topics')
@Controller('topics')
export class TopicController {
  constructor(
    @InjectTopicService()
    private readonly _topicService: ITopicService,
  ) {}

  @ApiOperation({ summary: 'Creates a new topic' })
  @ApiCreatedResponse({
    type: Topic,
    description: 'The topic was successfully created',
  })
  @ApiBadRequestResponse({
    description: 'The payload was sent with invalid or missing fields',
    schema: {
      example: {
        statusCode: 400,
        message: ['It is required to send the topic name'],
        error: 'Bad Request',
      },
    },
  })
  @AllowFor(/.*/)
  @Post()
  createOne(@RequestUser() requestUser: User, @Body() dto: CreateTopicDto) {
    return this._topicService.createOne(requestUser, dto);
  }

  @ApiOperation({ summary: 'Retrieves a topic given it id' })
  @ApiOkResponse({
    type: Topic,
    description: 'The topic was found',
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
    return this._topicService.findOne(requestUser, id);
  }

  @ApiOperation({ summary: 'Retrieves several topics' })
  @ApiOkResponse({
    type: TopicPageDto,
    description: 'The list of topics',
  })
  @ApiUnauthorized()
  @ApiForbidden()
  @Public()
  @Get()
  findMany(@RequestUser() requestUser: User, @Query() query: PageQuery) {
    return this._topicService.findMany(requestUser, query);
  }

  @ApiOperation({ summary: 'Deletes one topic' })
  @ApiOkResponse({
    type: Project,
    description: 'The topic was successfully deleted',
  })
  @ApiUnauthorized()
  @ApiForbidden()
  @ApiNotFound(Project)
  @AllowFor(/.*/)
  @Delete(':id')
  deleteOne(
    @Param('id', ParseUUIDPipe) id: string,
    @RequestUser() requestUser: User,
  ) {
    return this._topicService.deleteOne(requestUser, id);
  }
}

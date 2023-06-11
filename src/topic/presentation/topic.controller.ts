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
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { AllowFor } from '../../common/infrastructure/decorators/auth/allow-for.decorator';
import { RequestUser } from '../../common/infrastructure/decorators/request-user/request-user.decorator';

import { User } from '../../user/domain/models/user';
import { CreateTopicDto } from './create-topic.dto';

import { PageQuery } from '../../common/presentation/page.query';
import { CreateTopicUseCase } from '../usecases/create-topic.usecase';
import { DeleteTopicUseCase } from '../usecases/delete-topic.usecase';
import { FindManyTopicsUseCase } from '../usecases/find-many-topics.usecase';
import { FindOneTopicUseCase } from '../usecases/find-one-topic.usecase';
import { TopicPagePresenter } from './topic-page.presenter';
import { TopicPresenter } from './topic.presenter';

@ApiTags('topics')
@Controller('topics')
export class TopicController {
  constructor(
    private readonly _createTopicUseCase: CreateTopicUseCase,
    private readonly _findOneTopicUseCase: FindOneTopicUseCase,
    private readonly _deleteTopicUseCase: DeleteTopicUseCase,
    private readonly _findManyTopicsUseCase: FindManyTopicsUseCase,
  ) {}

  @ApiOperation({ summary: 'Creates a new topic' })
  @ApiCreatedResponse({
    type: TopicPresenter,
    description: 'The topic was successfully created',
  })
  @AllowFor(/.*/)
  @Post()
  async createOne(
    @RequestUser() requestUser: User,
    @Body() dto: CreateTopicDto,
  ) {
    const result = await this._createTopicUseCase.create(requestUser, dto);

    if (result.isRight()) {
      return new TopicPresenter(result.value);
    }

    throw result.value;
  }

  @ApiOperation({ summary: 'Retrieves a topic given its id' })
  @ApiOkResponse({
    type: TopicPresenter,
    description: 'The topic was found',
  })
  @Get(':id')
  async findOne(
    @RequestUser() requestUser: User,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    const result = await this._findOneTopicUseCase.find(requestUser, id);

    if (result.isRight()) {
      return new TopicPresenter(result.value);
    }

    throw result.value;
  }

  @ApiOperation({ summary: 'Retrieves several topics' })
  @ApiOkResponse({
    type: TopicPagePresenter,
    description: 'The list of topics',
  })
  @Get()
  async findMany(@RequestUser() requestUser: User, @Query() query: PageQuery) {
    const result = await this._findManyTopicsUseCase.find(requestUser, query);

    if (result.isRight()) {
      return new TopicPagePresenter(result.value);
    }

    throw result.value;
  }

  @ApiOperation({ summary: 'Deletes one topic' })
  @ApiNoContentResponse({ description: 'The topic was successfully deleted' })
  @AllowFor(/.*/)
  @Delete(':id')
  async deleteOne(
    @Param('id', ParseUUIDPipe) id: string,
    @RequestUser() requestUser: User,
  ) {
    const result = await this._deleteTopicUseCase.delete(requestUser, id);

    if (result.isLeft()) {
      throw result.value;
    }
  }
}

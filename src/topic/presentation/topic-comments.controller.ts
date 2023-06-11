import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
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

import { User } from '../../user/domain/models/user';
import { CreateCommentDto } from './create-comment.dto';

import { PageQuery } from '../../common/presentation/page.query';
import { CreateCommentUsecase } from '../usecases/create-comment.usecase';
import { FindManyCommentsUseCase } from '../usecases/find-many-comments.usecase';
import { CommentPagePresenter } from './comment-page.presenter';
import { CommentPresenter } from './comment.presenter';

@ApiTags('topics')
@Controller('topics/:id/comments')
export class TopicCommentsController {
  constructor(
    private readonly _createCommentUseCase: CreateCommentUsecase,
    private readonly _findManyCommentsUseCase: FindManyCommentsUseCase,
  ) {}

  @ApiOperation({ summary: 'Creates a new comment' })
  @ApiCreatedResponse({
    type: CommentPresenter,
    description: 'The comment was successfully created',
  })
  @AllowFor(/.*/)
  @Post()
  async createOne(
    @RequestUser() requestUser: User,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateCommentDto,
  ) {
    const result = await this._createCommentUseCase.create(
      requestUser,
      id,
      dto,
    );

    if (result.isRight()) {
      return new CommentPresenter(result.value);
    }

    throw result.value;
  }

  @ApiOperation({ summary: 'Retrieves several comments' })
  @ApiOkResponse({
    type: CommentPagePresenter,
    description: 'The list of comments',
  })
  @Public()
  @Get()
  async findMany(
    @RequestUser() requestUser: User,
    @Param('topicId', ParseUUIDPipe) topicId: string,
    @Query() query: PageQuery,
  ) {
    const result = await this._findManyCommentsUseCase.find(
      requestUser,
      topicId,
      query,
    );

    if (result.isRight()) {
      return new CommentPagePresenter(result.value);
    }

    throw result.value;
  }
}

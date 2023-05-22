import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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
import { InjectCommentService } from '../decorators/inject-service.decorator';

import { ParseUUIDPipe } from '../../common/pipes/parse-uuid/parse-uuid.pipe';

import { User } from '../../user/entities/user.entity';
import { Comment } from '../entities/comment.entity';
import { Topic } from '../entities/topic.entity';

import { CreateCommentDto } from '../dtos/create-comment.dto';

import { ICommentService } from '../interfaces/comment.service.interface';

import { PageQuery } from '../../common/classes/page.query';

@ApiTags('topics')
@Controller('topics/:topicId/comments')
export class CommentController {
  constructor(
    @InjectCommentService()
    private readonly _commentService: ICommentService,
  ) {}

  @ApiOperation({ summary: 'Creates a new comment' })
  @ApiCreatedResponse({
    type: Comment,
    description: 'The comment was successfully created',
  })
  @ApiBadRequestResponse({
    description: 'The payload was sent with invalid or missing fields',
    schema: {
      example: {
        statusCode: 400,
        message: ['It is required to send the comment text'],
        error: 'Bad Request',
      },
    },
  })
  @ApiUnauthorized()
  @ApiForbidden()
  @AllowFor(/.*/)
  @Post()
  createOne(
    @RequestUser() requestUser: User,
    @Param('topicId', ParseUUIDPipe) topicId: string,
    @Body() dto: CreateCommentDto,
  ) {
    return this._commentService.createOne(requestUser, topicId, dto);
  }

  @ApiOperation({ summary: 'Retrieves a comment given it id' })
  @ApiOkResponse({
    type: Comment,
    description: 'The comment was found',
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
  @ApiNotFound(Comment)
  @ApiForbidden()
  @Public()
  @Get(':commentId')
  findOne(
    @RequestUser() requestUser: User,
    @Param('topicId', ParseUUIDPipe) topicId: string,
    @Param('commentId', ParseUUIDPipe) commentId: string,
  ) {
    return this._commentService.findOne(requestUser, topicId, commentId);
  }

  @ApiOperation({ summary: 'Retrieves several comments' })
  @ApiNotFound(Topic)
  @ApiForbidden()
  @Public()
  @Get()
  findMany(
    @RequestUser() requestUser: User,
    @Param('topicId', ParseUUIDPipe) topicId: string,
    @Query() query: PageQuery,
  ) {
    return this._commentService.findMany(requestUser, topicId, query);
  }

  @ApiUnauthorized()
  @ApiForbidden()
  @ApiNotFound(Comment)
  @AllowFor(/.*/)
  @Delete(':commentId')
  deleteOne(
    @RequestUser() requestUser: User,
    @Param('topicId', ParseUUIDPipe) topicId: string,
    @Param('commentId', ParseUUIDPipe) commentId: string,
  ) {
    return this._commentService.deleteOne(requestUser, commentId, topicId);
  }
}

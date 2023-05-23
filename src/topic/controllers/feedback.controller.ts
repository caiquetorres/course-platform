import { Controller, Delete, Get, Param, Put } from '@nestjs/common';
import {
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { ApiForbidden } from '../../common/decorators/api/api-forbidden.decorator';
import { ApiUnauthorized } from '../../common/decorators/api/api-unauthorized.decorator';
import { AllowFor } from '../../common/decorators/auth/allow-for.decorator';
import { Public } from '../../common/decorators/auth/public.decorator';
import { RequestUser } from '../../common/decorators/request-user/request-user.decorator';
import { InjectFeedbackService } from '../decorators/inject-service.decorator';

import { ParseUUIDPipe } from '../../common/pipes/parse-uuid/parse-uuid.pipe';

import { User } from '../../user/entities/user.entity';

import { IFeedbackService } from '../interfaces/feedback.service.interface';

@ApiTags('topics')
@Controller('topics/:topicId/comments/:commentId')
export class FeedbackController {
  constructor(
    @InjectFeedbackService()
    private readonly _feedbackService: IFeedbackService,
  ) {}

  @ApiOperation({ summary: 'Likes a comment' })
  @ApiNoContentResponse({ description: 'The like was successfully created' })
  @ApiUnauthorized()
  @ApiForbidden()
  @AllowFor(/.*/)
  @Put('like')
  like(
    @RequestUser() requestUser: User,
    @Param('topicId', ParseUUIDPipe) topicId: string,
    @Param('commentId', ParseUUIDPipe) commentId: string,
  ) {
    return this._feedbackService.like(requestUser, topicId, commentId);
  }

  @ApiOperation({ summary: 'Retrieves the like count given a comment' })
  @ApiOkResponse({ type: Number })
  @ApiUnauthorized()
  @ApiForbidden()
  @Public()
  @Get('likes/count')
  likesCount(
    @RequestUser() requestUser: User,
    @Param('topicId', ParseUUIDPipe) topicId: string,
    @Param('commentId', ParseUUIDPipe) commentId: string,
  ) {
    return this._feedbackService.likesCount(requestUser, topicId, commentId);
  }

  @ApiOperation({ summary: 'Deslikes a comment' })
  @ApiNoContentResponse({ description: 'The like was successfully deleted' })
  @ApiUnauthorized()
  @ApiForbidden()
  @AllowFor(/.*/)
  @Delete('deslike')
  deslike(
    @RequestUser() requestUser: User,
    @Param('topicId', ParseUUIDPipe) topicId: string,
    @Param('commentId', ParseUUIDPipe) commentId: string,
  ) {
    return this._feedbackService.deslike(requestUser, topicId, commentId);
  }
}

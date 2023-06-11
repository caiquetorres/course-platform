import {
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Put,
} from '@nestjs/common';
import {
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { AllowFor } from '../../common/infrastructure/decorators/auth/allow-for.decorator';
import { Public } from '../../common/infrastructure/decorators/auth/public.decorator';
import { RequestUser } from '../../common/infrastructure/decorators/request-user/request-user.decorator';

import { User } from '../../user/domain/models/user';

import { CountLikesUseCase } from '../usecases/count-likes.usecase';
import { DeslikeCommentUseCase } from '../usecases/deslike-comment.usecase';
import { LikeCommentUseCase } from '../usecases/like-comment.usecase';

@ApiTags('comments')
@Controller('comments/:id')
export class CommentFeedbackController {
  constructor(
    private readonly _likeCommentUseCase: LikeCommentUseCase,
    private readonly _deslikeCommentUseCase: DeslikeCommentUseCase,
    private readonly _countLikesUseCase: CountLikesUseCase,
  ) {}

  @ApiOperation({ summary: 'Likes a comment' })
  @ApiNoContentResponse({ description: 'The like was successfully created' })
  @AllowFor(/.*/)
  @Put('like')
  async like(
    @RequestUser() requestUser: User,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    const result = await this._likeCommentUseCase.like(requestUser, id);

    if (result.isLeft()) {
      throw result.value;
    }
  }

  @ApiOperation({ summary: 'Retrieves the like count given a comment' })
  @ApiOkResponse({ type: Number })
  @Public()
  @Get('likes/count')
  async likesCount(
    @RequestUser() requestUser: User,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    const result = await this._countLikesUseCase.count(requestUser, id);

    if (result.isRight()) {
      return result.value;
    }

    throw result.value;
  }

  @ApiOperation({ summary: 'Deslikes a comment' })
  @ApiNoContentResponse({ description: 'The like was successfully deleted' })
  @AllowFor(/.*/)
  @Delete('deslike')
  async deslike(
    @RequestUser() requestUser: User,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    const result = await this._deslikeCommentUseCase.deslike(requestUser, id);

    if (result.isLeft()) {
      throw result.value;
    }
  }
}

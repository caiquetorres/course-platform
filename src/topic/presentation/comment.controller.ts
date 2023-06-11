import { Controller, Delete, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AllowFor } from '../../common/infrastructure/decorators/auth/allow-for.decorator';
import { Public } from '../../common/infrastructure/decorators/auth/public.decorator';
import { RequestUser } from '../../common/infrastructure/decorators/request-user/request-user.decorator';

import { User } from '../../user/domain/models/user';

import { FindOneCommentUseCase } from '../usecases/find-one-comment.usecase';
import { CommentPresenter } from './comment.presenter';

@ApiTags('comments')
@Controller('comments')
export class CommentController {
  constructor(private readonly _findOneCommentUseCase: FindOneCommentUseCase) {}

  @ApiOperation({ summary: 'Retrieves a comment given it id' })
  @ApiOkResponse({
    type: CommentPresenter,
    description: 'The comment was found',
  })
  @Public()
  @Get(':id')
  async findOne(@RequestUser() requestUser: User, @Param('id') id: string) {
    const result = await this._findOneCommentUseCase.find(requestUser, id);

    if (result.isRight()) {
      return new CommentPresenter(result.value);
    }

    throw result.value;
  }

  @ApiOperation({ summary: 'Deletes a comment given it id' })
  @AllowFor(/.*/)
  @Delete(':id')
  async deleteOne(@RequestUser() requestUser: User, @Param('id') id: string) {
    const result = await this._findOneCommentUseCase.find(requestUser, id);

    if (result.isLeft()) {
      throw result.value;
    }
  }
}

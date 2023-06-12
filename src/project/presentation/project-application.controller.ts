import { Controller, Delete, Param, Post } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { AllowFor } from '../../common/infrastructure/decorators/auth/allow-for.decorator';
import { RequestUser } from '../../common/infrastructure/decorators/request-user/request-user.decorator';

import { Role } from '../../user/domain/models/role.enum';
import { User } from '../../user/domain/models/user';

import { ApplyToProjectUseCase } from '../usecases/apply-to-project.usecase';
import { QuitFromProjectUseCase } from '../usecases/quit-from-project.usecase';

@ApiTags('projects')
@Controller('projects/:id')
export class ProjectApplicationController {
  constructor(
    private readonly _applyToProjectUseCase: ApplyToProjectUseCase,
    private readonly _quitFromProjectUseCase: QuitFromProjectUseCase,
  ) {}

  @ApiOperation({ summary: 'Applies into a project' })
  @ApiCreatedResponse({
    type: null,
    description: 'The application was successfully created',
  })
  @AllowFor(Role.pro)
  @Post('apply')
  async apply(
    @RequestUser() requestUser: User,
    @Param('id') projectId: string,
  ) {
    const result = await this._applyToProjectUseCase.apply(
      requestUser,
      projectId,
    );

    if (result.isLeft()) {
      throw result.value;
    }
  }

  @ApiOperation({ summary: 'Quits from a project' })
  @ApiNoContentResponse({
    description: 'The application was successfully deleted',
  })
  @AllowFor(Role.pro)
  @Delete('quit')
  async quit(@RequestUser() requestUser: User, @Param('id') projectId: string) {
    const result = await this._quitFromProjectUseCase.quit(
      requestUser,
      projectId,
    );

    if (result.isLeft()) {
      throw result.value;
    }
  }
}

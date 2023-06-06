import {
  Body,
  ConflictException,
  Controller,
  ForbiddenException,
  Get,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { ApiUnauthorized } from '../../common/infrastructure/decorators/api/api-unauthorized.decorator';
import { AllowFor } from '../../common/infrastructure/decorators/auth/allow-for.decorator';
import { Public } from '../../common/infrastructure/decorators/auth/public.decorator';
import { RequestUser } from '../../common/infrastructure/decorators/request-user/request-user.decorator';

import { Role } from '../domain/models/role.enum';
import { User } from '../domain/models/user';
import { CreateUserDto } from './create-user.dto';

import { ForbiddenError } from '../../common/domain/errors/forbidden.error';
import { DuplicatedEmailError } from '../domain/errors/duplicated-email.error';
import { DuplicatedUsernameError } from '../domain/errors/duplicated-username.error';
import { CreateUserUseCase } from '../usecases/create-user.usecase';
import { FindMeUseCase } from '../usecases/get-me.usecase';
import { UserPresenter } from './user.presenter';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(
    private readonly _createUserUseCase: CreateUserUseCase,
    private readonly _getMeUseCase: FindMeUseCase,
  ) {}

  /**
   * Creates a new user with the given data.
   *
   * @param _requestUser The user who is creating the user.
   * @param dto The data for the new user.
   * @returns A Promise that resolves to the created user.
   * @throws {ConflictException} If a user with the given email or username
   * already exists.
   */
  @ApiOperation({ summary: 'Creates a new user' })
  @ApiCreatedResponse({
    type: UserPresenter,
    description: 'The user was successfully created',
  })
  @ApiBadRequestResponse({
    description: 'The payload was sent with invalid or missing fields',
    schema: {
      example: {
        statusCode: 400,
        message: ['It is required to send the user username'],
        error: 'Bad Request',
      },
    },
  })
  @ApiConflictResponse({
    description: 'An user with the given email or username already exists',
    schema: {
      example: {
        status: 409,
        message: "The user with the email 'jane.doe@puppy.com' already exists",
        error: 'Conflict',
      },
    },
  })
  @Public()
  @Post()
  async createOne(
    @RequestUser() requestUser: User,
    @Body() dto: CreateUserDto,
  ) {
    const result = await this._createUserUseCase.create(requestUser, dto);

    if (result.isRight()) {
      return new UserPresenter(result.value);
    }

    if (
      result.value instanceof DuplicatedEmailError ||
      result.value instanceof DuplicatedUsernameError
    ) {
      throw new ConflictException(result.value.message);
    }

    throw new InternalServerErrorException(
      'An issue occurred during user creation. If the error persists, please contact the administrators.',
    );
  }

  /**
   * Retrieves the logged-in user.
   *
   * @summary Retrieves the logged-in user.
   * @returns A Promise that resolves to the found user entity.
   * @throws {UnauthorizedException} If the user is not authenticated.
   */
  @ApiOperation({
    summary: 'Retrieves the logged user',
    requestBody: null,
  })
  @ApiOkResponse({
    type: User,
    description: 'The entity was found',
  })
  @ApiUnauthorized()
  @AllowFor(Role.user)
  @Get('me')
  async findMe(@RequestUser() requestUser: User) {
    const result = await this._getMeUseCase.findMe(requestUser);

    if (result.isRight()) {
      return new UserPresenter(result.value);
    }

    if (result.value instanceof ForbiddenError) {
      throw new ForbiddenException(result.value.message);
    }

    throw new InternalServerErrorException(
      'An issue occurred during user creation. If the error persists, please contact the administrators.',
    );
  }
}

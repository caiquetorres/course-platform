import {
  Body,
  ConflictException,
  Controller,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { Public } from '../../common/infrastructure/decorators/auth/public.decorator';
import { RequestUser } from '../../common/infrastructure/decorators/request-user/request-user.decorator';

import { User } from '../domain/models/user';
import { CreateUserDto } from './create-user.dto';

import { DuplicatedEmailError } from '../domain/errors/duplicated-email.error';
import { DuplicatedUsernameError } from '../domain/errors/duplicated-username.error';
import { CreateUserUseCase } from '../usecases/create-user.usecase';
import { UserPresenter } from './user.presenter';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

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
    const result = await this.createUserUseCase.create(requestUser, dto);

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
}

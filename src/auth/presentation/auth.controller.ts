import { Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { Public } from '../../common/infrastructure/decorators/auth/public.decorator';
import { RequestUser } from '../../common/infrastructure/decorators/request-user/request-user.decorator';

import { LocalGuard } from '../infrastructure/guards/local.guard';

import { User } from '../../user/domain/models/user';

import { LoginUseCase } from '../usecases/login.usecase';
import { TokenPresenter } from './token.presenter';

/**
 * A controller that provides authentication-related routes.
 */
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly _loginUseCase: LoginUseCase) {}

  /**
   * Authenticates a user and returns a JWT.
   *
   * @param requestUser The that is consuming the route.
   * @returns A object containing the JWT and its expiration time.
   * @throws {UnauthorizedException} If the provided credentials are
   * invalid.
   */
  @ApiOperation({
    summary: 'Authenticates a user by their username and password',
  })
  @ApiOkResponse({ type: TokenPresenter })
  @ApiBody({
    schema: {
      example: {
        username: 'janedoe',
        password: '123456',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'The token is invalid or missing',
    schema: {
      example: {
        statusCode: 401,
        message:
          'Invalid username or password. Please check your credentials and try again',
        error: 'Unauthorized',
      },
    },
  })
  @UseGuards(LocalGuard)
  @Post('login')
  @Public()
  @HttpCode(200)
  login(@RequestUser() requestUser: User) {
    return this._loginUseCase.login(requestUser);
  }
}

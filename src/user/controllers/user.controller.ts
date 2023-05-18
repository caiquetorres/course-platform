import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { Public } from '../../common/decorators/auth/public.decorator';
import { RequestUser } from '../../common/decorators/request-user/request-user.decorator';

import { User } from '../entities/user.entity';

import { CreateUserDto } from '../dtos/create-user.dto';

import { UserService } from '../services/user.service';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @ApiOperation({ summary: 'Creates a new user' })
  @ApiCreatedResponse({
    type: User,
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
  createOne(@Body() dto: CreateUserDto, @RequestUser() requestUser: User) {
    return this._userService.createOne(requestUser, dto);
  }
}

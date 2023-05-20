import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
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
import { InjectUserService } from '../decorators/inject-service.decorator';

import { ParseUUIDPipe } from '../../common/pipes/parse-uuid/parse-uuid.pipe';

import { User } from '../entities/user.entity';

import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UserPageDto } from '../dtos/user-page.dto';
import { Role } from '../enums/role.enum';

import { IUserService } from '../interfaces/user.service.interface';

import { PageQuery } from '../../common/classes/page.query';

/**
 * A controller that provides CRUD operations for users.
 */
@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(
    @InjectUserService()
    private readonly _userService: IUserService,
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
  createOne(@RequestUser() requestUser: User, @Body() dto: CreateUserDto) {
    return this._userService.createOne(requestUser, dto);
  }

  /**
   * Retrieves the logged-in user.
   *
   * @summary Retrieves the logged-in user.
   * @returns A Promise that resolves to the found user entity.
   * @throws {UnauthorizedException} If the user is not authenticated.
   */
  @ApiOperation({ summary: 'Retrieves the logged user' })
  @ApiOkResponse({
    type: User,
    description: 'The entity was found',
  })
  @ApiUnauthorized()
  @AllowFor(Role.user)
  @Get('me')
  getMe(@RequestUser() requestUser: User) {
    return this._userService.findOne(requestUser, requestUser.id);
  }

  /**
   * Finds a user with the given id.
   *
   * @param id The id of the user to find.
   * @returns A Promise that resolves to the found user.
   * @throws {NotFoundException} If no user with the given id is found.
   */
  @ApiOperation({ summary: 'Retrieves a user given it id' })
  @ApiOkResponse({
    type: User,
    description: 'The user was found',
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
  @ApiUnauthorized()
  @ApiForbidden()
  @ApiNotFound(User)
  @AllowFor(Role.user)
  @Get(':id')
  findOne(
    @RequestUser() requestUser: User,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this._userService.findOne(requestUser, id);
  }

  /**
   * Finds multiple users based on the provided query parameters.
   *
   * @param query The query object specifying pagination parameters and
   * filters.
   * @param requestUser The user making the request.
   * @returns A Promise that resolves to a paginated list of users.
   * @throws {ForbiddenException} If the user does not have permission to access the resource.
   */
  @ApiOperation({ summary: 'Retrieves several users' })
  @ApiOkResponse({
    type: UserPageDto,
    description: 'The list of users',
  })
  @ApiUnauthorized()
  @ApiForbidden()
  @AllowFor(Role.admin)
  @Get()
  findMany(@RequestUser() requestUser: User, @Query() query: PageQuery) {
    return this._userService.findMany(requestUser, query);
  }

  /**
   * Updates a user with the given ID.
   *
   * @param requestUser The user making the request.
   * @param id The ID of the user to update.
   * @param dto The data to update the user with.
   * @returns A Promise that resolves to the updated user.
   * @throws {NotFoundException} If the user with the given ID does not
   * exist or is disabled.
   * @throws {ForbiddenException} If the user does not have permission to
   * update the resource.
   */
  @ApiOperation({ summary: 'Updates one user' })
  @ApiOkResponse({
    type: User,
    description: 'The user was successfully updated',
  })
  @ApiBadRequestResponse({
    description: 'The payload was sent with invalid or missing fields',
    schema: {
      example: {
        statusCode: 400,
        message: [
          'It is required to send name with length greater than 2 characters',
        ],
        error: 'Bad Request',
      },
    },
  })
  @ApiUnauthorized()
  @ApiForbidden()
  @ApiNotFound(User)
  @AllowFor(Role.user)
  @Put(':id')
  updateOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserDto,
    @RequestUser() requestUser: User,
  ) {
    return this._userService.updateOne(requestUser, id, dto);
  }

  /**
   * Removes a user with the given ID.
   *
   * @param requestUser The user making the request.
   * @param id The ID of the user to remove.
   * @returns A Promise that resolves when the user is successfully
   * removed.
   * @throws {NotFoundException} If the user with the given ID does not
   * exist or is disabled.
   * @throws {ForbiddenException} If the user does not have permission to
   * remove the resource.
   */
  @ApiOperation({ summary: 'Deletes one user' })
  @ApiOkResponse({
    type: User,
    description: 'The user was successfully deleted',
  })
  @ApiUnauthorized()
  @ApiForbidden()
  @ApiNotFound(User)
  @AllowFor(Role.user)
  @Delete(':id')
  deleteOne(
    @Param('id', ParseUUIDPipe) id: string,
    @RequestUser() requestUser: User,
  ) {
    return this._userService.deleteOne(requestUser, id);
  }
}

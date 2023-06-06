import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { AllowFor } from '../../common/infrastructure/decorators/auth/allow-for.decorator';
import { Public } from '../../common/infrastructure/decorators/auth/public.decorator';
import { RequestUser } from '../../common/infrastructure/decorators/request-user/request-user.decorator';

import { Role } from '../domain/models/role.enum';
import { User } from '../domain/models/user';
import { CreateUserDto } from './create-user.dto';
import { UpdateUserDto } from './update-user.dto';

import { PageQuery } from '../../common/presentation/page.query';
import { CreateUserUseCase } from '../usecases/create-user.usecase';
import { DeleteUserUseCase } from '../usecases/delete-user.usecase';
import { FindManyUsersUseCase } from '../usecases/find-many-users.usecase';
import { FindMeUseCase } from '../usecases/find-me.usecase';
import { FindOneUserUseCase } from '../usecases/find-one-user.usecase';
import { UpdateUserUseCase } from '../usecases/update-user.usecase';
import { UserPagePresenter } from './user-page.presenter';
import { UserPresenter } from './user.presenter';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(
    private readonly _createUserUseCase: CreateUserUseCase,
    private readonly _getMeUseCase: FindMeUseCase,
    private readonly _findOneUseCase: FindOneUserUseCase,
    private readonly _findManyUsersUseCase: FindManyUsersUseCase,
    private readonly _updateUserUseCase: UpdateUserUseCase,
    private readonly _deleteUserUseCase: DeleteUserUseCase,
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
  @Public()
  @Post()
  async createOne(
    @RequestUser() requestUser: User,
    @Body() dto: CreateUserDto,
  ) {
    const result = await this._createUserUseCase.create(requestUser, dto);

    if (result.isRight()) {
      new UserPresenter(result.value);
    }

    throw result.value;
  }

  /**
   * Retrieves the logged-in user.
   *
   * @summary Retrieves the logged-in user.
   * @returns A Promise that resolves to the found user entity.
   * @throws {UnauthorizedException} If the user is not authenticated.
   */
  @ApiOperation({ summary: 'Retrieves the logged user', requestBody: null })
  @ApiOkResponse({ type: UserPresenter, description: 'The entity was found' })
  @AllowFor(Role.user)
  @Get('me')
  async findMe(@RequestUser() requestUser: User) {
    const result = await this._getMeUseCase.findMe(requestUser);

    if (result.isRight()) {
      return new UserPresenter(result.value);
    }

    throw result.value;
  }

  /**
   * Finds a user with the given id.
   *
   * @param id The id of the user to find.
   * @returns A Promise that resolves to the found user.
   * @throws {NotFoundException} If no user with the given id is found.
   */
  @ApiOperation({ summary: 'Retrieves a user given it id' })
  @ApiOkResponse({ type: UserPresenter, description: 'The user was found' })
  @AllowFor(Role.user)
  @Get(':id')
  async findOne(
    @RequestUser() requestUser: User,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    const result = await this._findOneUseCase.findOne(requestUser, id);

    if (result.isRight()) {
      return new UserPresenter(result.value);
    }

    if (result.isRight()) {
      new UserPresenter(result.value);
    }

    throw result.value;
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
  @ApiOkResponse({ type: UserPagePresenter, description: 'The list of users' })
  @AllowFor(Role.admin)
  @Get()
  async findMany(@RequestUser() requestUser: User, @Query() query: PageQuery) {
    const result = await this._findManyUsersUseCase.findMany(
      requestUser,
      query,
    );

    if (result.isRight()) {
      return result.value;
    }

    throw result.value;
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
    type: UserPresenter,
    description: 'The user was successfully updated',
  })
  @AllowFor(Role.user)
  @Put(':id')
  updateOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserDto,
    @RequestUser() requestUser: User,
  ) {
    return this._updateUserUseCase.update(requestUser, id, dto);
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
  @ApiNoContentResponse()
  @AllowFor(Role.user)
  @Delete(':id')
  deleteOne(
    @Param('id', ParseUUIDPipe) id: string,
    @RequestUser() requestUser: User,
  ) {
    return this._deleteUserUseCase.delete(requestUser, id);
  }
}

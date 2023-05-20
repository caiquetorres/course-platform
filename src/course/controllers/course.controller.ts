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
  ApiBadRequestResponse,
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
import { InjectCourseService } from '../decorators/inject-course-service.decorator';

import { User } from '../../user/entities/user.entity';
import { Course } from '../entities/course.entity';

import { Role } from '../../user/enums/role.enum';
import { CreateCourseDto } from '../dtos/create-course.dto';
import { UpdateCourseDto } from '../dtos/update-course.dto';
import { CoursePageDto } from '../dtos/user-page.dto';

import { ICourseService } from '../interfaces/course.service.interface';

import { PageQuery } from '../../common/classes/page.query';

@ApiTags('courses')
@Controller('courses')
export class CourseController {
  constructor(
    @InjectCourseService()
    private readonly _courseService: ICourseService,
  ) {}

  @ApiOperation({ summary: 'Creates a new course' })
  @ApiCreatedResponse({
    type: Course,
    description: 'The course was successfully created',
  })
  @ApiBadRequestResponse({
    description: 'The payload was sent with invalid or missing fields',
    schema: {
      example: {
        statusCode: 400,
        message: ['It is required to send the course name'],
        error: 'Bad Request',
      },
    },
  })
  @AllowFor(Role.admin)
  @Post()
  createOne(@RequestUser() requestUser: User, @Body() dto: CreateCourseDto) {
    return this._courseService.createOne(requestUser, dto);
  }

  @ApiOperation({ summary: 'Retrieves a course given it id' })
  @ApiOkResponse({
    type: Course,
    description: 'The course was found',
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
  @ApiNotFound(Course)
  @Public()
  @Get(':id')
  findOne(
    @RequestUser() requestUser: User,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this._courseService.findOne(requestUser, id);
  }

  @ApiOperation({ summary: 'Retrieves several courses' })
  @ApiOkResponse({
    type: CoursePageDto,
    description: 'The list of courses',
  })
  @ApiUnauthorized()
  @ApiForbidden()
  @Public()
  @Get()
  findMany(@RequestUser() requestUser: User, @Query() query: PageQuery) {
    return this._courseService.findMany(requestUser, query);
  }

  @ApiOperation({ summary: 'Updates one course' })
  @ApiOkResponse({
    type: Course,
    description: 'The course was successfully updated',
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
  @ApiNotFound(Course)
  @AllowFor(Role.user)
  @Put(':id')
  updateOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCourseDto,
    @RequestUser() requestUser: User,
  ) {
    return this._courseService.updateOne(requestUser, id, dto);
  }

  @ApiOperation({ summary: 'Deletes one course' })
  @ApiOkResponse({
    type: Course,
    description: 'The course was successfully deleted',
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
    return this._courseService.deleteOne(requestUser, id);
  }
}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CourseEntity } from './infrastructure/entities/course.entity';

import { CourseController } from './presentation/course.controller';

import { CourseRepository } from './infrastructure/repositories/course.repository';
import { CourseTypeOrmRepository } from './infrastructure/repositories/typeorm/course-typeorm.repository';
import { CreateCourseUseCase } from './usecases/create-course.usecase';
import { FindManyCoursesUseCase } from './usecases/find-many-courses.usecase';
import { FindOneCourseUseCase } from './usecases/find-one-course.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([CourseEntity])],
  controllers: [CourseController],
  providers: [
    CreateCourseUseCase,
    FindOneCourseUseCase,
    FindManyCoursesUseCase,
    {
      provide: CourseRepository,
      useClass: CourseTypeOrmRepository,
    },
  ],
})
export class CourseModule {}

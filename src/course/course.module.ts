import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CourseEntity } from './infrastructure/entities/course.entity';
import { EnrollmentEntity } from './infrastructure/entities/enrollment.entity';

import { CourseController } from './presentation/course.controller';
import { EnrollmentController } from './presentation/enrollment.controller';

import { CourseRepository } from './infrastructure/repositories/course.repository';
import { EnrollmentRepository } from './infrastructure/repositories/enrollment.repository';
import { CourseTypeOrmRepository } from './infrastructure/repositories/typeorm/course-typeorm.repository';
import { EnrollmentTypeOrmRepository } from './infrastructure/repositories/typeorm/enrollment-typeorm.repository';
import { CreateCourseUseCase } from './usecases/create-course.usecase';
import { DeleteCourseUseCase } from './usecases/delete-course.usecase';
import { EnrollInCourseUseCase } from './usecases/enroll-in-course.usecase';
import { FindManyCoursesUseCase } from './usecases/find-many-courses.usecase';
import { FindOneCourseUseCase } from './usecases/find-one-course.usecase';
import { QuitFromCourseUseCase } from './usecases/quit-from-course.usecase';
import { UpdateCourseUseCase } from './usecases/update-course.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([CourseEntity, EnrollmentEntity])],
  controllers: [CourseController, EnrollmentController],
  providers: [
    CreateCourseUseCase,
    FindOneCourseUseCase,
    FindManyCoursesUseCase,
    UpdateCourseUseCase,
    DeleteCourseUseCase,
    EnrollInCourseUseCase,
    QuitFromCourseUseCase,
    {
      provide: CourseRepository,
      useClass: CourseTypeOrmRepository,
    },
    {
      provide: EnrollmentRepository,
      useClass: EnrollmentTypeOrmRepository,
    },
  ],
  exports: [CourseRepository],
})
export class CourseModule {}

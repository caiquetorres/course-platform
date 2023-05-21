import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Course } from './entities/course.entity';
import { Enrollment } from './entities/enrollment.entity';

import { CourseService } from './services/course.service';

import { CourseController } from './controllers/course.controller';
import { EnrollmentController } from './controllers/enrollment.controller';

import { COURSE_SERVICE } from './constants/course.constant';

@Module({
  imports: [TypeOrmModule.forFeature([Course, Enrollment])],
  controllers: [CourseController, EnrollmentController],
  providers: [
    {
      provide: COURSE_SERVICE,
      useClass: CourseService,
    },
  ],
})
export class CourseModule {}

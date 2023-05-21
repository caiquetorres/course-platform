import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Course } from './entities/course.entity';

import { COURSE_SERVICE } from './constants/course.constant';
import { CourseService } from './services/course.service';

import { CourseController } from './controllers/course.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Course])],
  controllers: [CourseController],
  providers: [
    {
      provide: COURSE_SERVICE,
      useClass: CourseService,
    },
  ],
})
export class CourseModule {}

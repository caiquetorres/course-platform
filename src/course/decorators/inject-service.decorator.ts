import { Inject } from '@nestjs/common';

import { COURSE_SERVICE } from '../constants/course.constant';

export function InjectCourseService() {
  return Inject(COURSE_SERVICE);
}

export function InjectEnrollmentService() {
  return Inject(COURSE_SERVICE);
}

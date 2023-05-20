import { Inject } from '@nestjs/common';

import { COURSE_SERVICE } from '../constants/course-service.constant';

export function InjectCourseService() {
  return Inject(COURSE_SERVICE);
}

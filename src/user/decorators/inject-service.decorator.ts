import { Inject } from '@nestjs/common';

import {
  USER_COURSES_SERVICE,
  USER_SERVICE,
} from '../constants/service.constant';

export function InjectUserService() {
  return Inject(USER_SERVICE);
}

export function InjectUserCoursesService() {
  return Inject(USER_COURSES_SERVICE);
}

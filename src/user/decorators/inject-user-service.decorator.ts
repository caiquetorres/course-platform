import { Inject } from '@nestjs/common';

import { USER_SERVICE } from '../constants/user-service.constant';

export function InjectUserService() {
  return Inject(USER_SERVICE);
}

import { Inject } from '@nestjs/common';

import { PROJECT_SERVICE } from '../constants/project.constant';

export function InjectProjectService() {
  return Inject(PROJECT_SERVICE);
}

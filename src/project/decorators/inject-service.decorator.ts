import { Inject } from '@nestjs/common';

import {
  APPLICATION_SERVICE,
  PROJECT_SERVICE,
} from '../constants/project.constant';

export function InjectProjectService() {
  return Inject(PROJECT_SERVICE);
}

export function InjectApplicationService() {
  return Inject(APPLICATION_SERVICE);
}

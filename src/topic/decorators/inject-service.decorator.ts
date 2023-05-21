import { Inject } from '@nestjs/common';

import { TOPIC_SERVICE } from '../constants/topic.constant';

export function InjectTopicService() {
  return Inject(TOPIC_SERVICE);
}

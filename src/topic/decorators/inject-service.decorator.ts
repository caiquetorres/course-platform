import { Inject } from '@nestjs/common';

import { COMMENT_SERVICE, TOPIC_SERVICE } from '../constants/topic.constant';

export function InjectTopicService() {
  return Inject(TOPIC_SERVICE);
}

export function InjectCommentService() {
  return Inject(COMMENT_SERVICE);
}

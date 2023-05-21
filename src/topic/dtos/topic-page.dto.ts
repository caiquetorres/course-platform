import { Topic } from '../entities/topic.entity';

import { PageDto } from '../../common/models/page.dto';

export class TopicPageDto extends PageDto(Topic) {}

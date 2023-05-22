import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '../user/entities/user.entity';
import { Comment } from './entities/comment.entity';
import { Topic } from './entities/topic.entity';

import { CommentService } from './services/comment.service';
import { TopicService } from './services/topic.service';

import { CommentController } from './controllers/comment.controller';
import { TopicController } from './controllers/topic.controller';

import { COMMENT_SERVICE, TOPIC_SERVICE } from './constants/topic.constant';

@Module({
  imports: [TypeOrmModule.forFeature([Topic, User, Comment])],
  controllers: [TopicController, CommentController],
  providers: [
    {
      provide: TOPIC_SERVICE,
      useClass: TopicService,
    },
    {
      provide: COMMENT_SERVICE,
      useClass: CommentService,
    },
  ],
})
export class TopicModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '../user/entities/user.entity';
import { Topic } from './entities/topic.entity';

import { TopicService } from './services/topic.service';

import { TopicController } from './controllers/topic.controller';

import { TOPIC_SERVICE } from './constants/topic.constant';

@Module({
  imports: [TypeOrmModule.forFeature([Topic, User])],
  controllers: [TopicController],
  providers: [
    {
      provide: TOPIC_SERVICE,
      useClass: TopicService,
    },
  ],
})
export class TopicModule {}

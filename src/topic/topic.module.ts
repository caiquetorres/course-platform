import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommentEntity } from './infrastructure/entities/comment.entity';
import { FeedbackEntity } from './infrastructure/entities/feedback.entity';
import { TopicEntity } from './infrastructure/entities/topic.entity';

import { CreateTopicUseCase } from './usecases/create-topic.usecase';
import { FindOneTopicUseCase } from './usecases/find-one-topic.usecase';

@Module({
  imports: [
    TypeOrmModule.forFeature([TopicEntity, FeedbackEntity, CommentEntity]),
  ],
  providers: [CreateTopicUseCase, FindOneTopicUseCase],
})
export class TopicModule {}
